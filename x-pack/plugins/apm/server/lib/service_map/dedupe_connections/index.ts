/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { sortBy, pick, identity } from 'lodash';
import { ValuesType } from 'utility-types';
import {
  SERVICE_NAME,
  SPAN_DESTINATION_SERVICE_RESOURCE,
  SPAN_TYPE,
  SPAN_SUBTYPE
} from '../../../../common/elasticsearch_fieldnames';
import {
  Connection,
  ConnectionNode,
  ServiceConnectionNode,
  ExternalConnectionNode
} from '../../../../common/service_map';
import { ConnectionsResponse, ServicesResponse } from '../get_service_map';

function getConnectionNodeId(node: ConnectionNode): string {
  if ('span.destination.service.resource' in node) {
    // use a prefix to distinguish exernal destination ids from services
    return `>${node[SPAN_DESTINATION_SERVICE_RESOURCE]}`;
  }
  return node[SERVICE_NAME];
}

function getConnectionId(connection: Connection) {
  return `${getConnectionNodeId(connection.source)}~${getConnectionNodeId(
    connection.destination
  )}`;
}

export type ServiceMapResponse = ConnectionsResponse & {
  services: ServicesResponse;
};

export function dedupeConnections(response: ServiceMapResponse) {
  const { discoveredServices, services, connections } = response;

  const allNodes = connections
    .flatMap(connection => [connection.source, connection.destination])
    .map(node => ({ ...node, id: getConnectionNodeId(node) }))
    .concat(
      services.map(service => ({
        ...service,
        id: service[SERVICE_NAME]
      }))
    );

  const serviceNodes = allNodes.filter(node => SERVICE_NAME in node) as Array<
    ServiceConnectionNode & {
      id: string;
    }
  >;

  const externalNodes = allNodes.filter(
    node => SPAN_DESTINATION_SERVICE_RESOURCE in node
  ) as Array<
    ExternalConnectionNode & {
      id: string;
    }
  >;

  // 1. maps external nodes to internal services
  // 2. collapses external nodes into one node based on span.destination.service.resource
  // 3. picks the first available span.type/span.subtype in an alphabetically sorted list
  const nodeMap = allNodes.reduce((map, node) => {
    if (map[node.id]) {
      return map;
    }

    const matchedService = discoveredServices.find(({ from }) => {
      if ('span.destination.service.resource' in node) {
        return (
          node[SPAN_DESTINATION_SERVICE_RESOURCE] ===
          from[SPAN_DESTINATION_SERVICE_RESOURCE]
        );
      }
      return false;
    })?.to;

    let serviceName: string | undefined = matchedService?.[SERVICE_NAME];

    if (!serviceName && 'service.name' in node) {
      serviceName = node[SERVICE_NAME];
    }

    const matchedServiceNodes = services.filter(
      serviceNode => serviceNode[SERVICE_NAME] === serviceName
    );

    if (matchedServiceNodes.length) {
      return {
        ...map,
        [node.id]: Object.assign(
          {
            id: matchedServiceNodes[0][SERVICE_NAME]
          },
          ...matchedServiceNodes.map(serviceNode => pick(serviceNode, identity))
        )
      };
    }

    const allMatchedExternalNodes = externalNodes.filter(n => n.id === node.id);

    const firstMatchedNode = allMatchedExternalNodes[0];

    return {
      ...map,
      [node.id]: {
        ...firstMatchedNode,
        label: firstMatchedNode[SPAN_DESTINATION_SERVICE_RESOURCE],
        [SPAN_TYPE]: allMatchedExternalNodes.map(n => n[SPAN_TYPE]).sort()[0],
        [SPAN_SUBTYPE]: allMatchedExternalNodes
          .map(n => n[SPAN_SUBTYPE])
          .sort()[0]
      }
    };
  }, {} as Record<string, ConnectionNode & { id: string }>);

  // maps destination.address to service.name if possible
  function getConnectionNode(node: ConnectionNode) {
    return nodeMap[getConnectionNodeId(node)];
  }

  // build connections with mapped nodes
  const mappedConnections = connections
    .map(connection => {
      const sourceData = getConnectionNode(connection.source);
      const targetData = getConnectionNode(connection.destination);

      return {
        source: sourceData.id,
        target: targetData.id,
        id: getConnectionId({ source: sourceData, destination: targetData }),
        sourceData,
        targetData
      };
    })
    .filter(connection => connection.source !== connection.target);

  const nodes = mappedConnections
    .flatMap(connection => [connection.sourceData, connection.targetData])
    .concat(serviceNodes);

  const dedupedNodes: typeof nodes = [];

  nodes.forEach(node => {
    if (!dedupedNodes.find(dedupedNode => node.id === dedupedNode.id)) {
      dedupedNodes.push(node);
    }
  });

  type ConnectionWithId = ValuesType<typeof mappedConnections>;

  const connectionsById = mappedConnections.reduce(
    (connectionMap, connection) => {
      return {
        ...connectionMap,
        [connection.id]: connection
      };
    },
    {} as Record<string, ConnectionWithId>
  );

  // instead of adding connections in two directions,
  // we add a `bidirectional` flag to use in styling
  const dedupedConnections = (sortBy(
    Object.values(connectionsById),
    // make sure that order is stable
    'id'
  ) as ConnectionWithId[]).reduce<
    Array<
      ConnectionWithId & { bidirectional?: boolean; isInverseEdge?: boolean }
    >
  >((prev, connection) => {
    const reversedConnection = prev.find(
      c => c.target === connection.source && c.source === connection.target
    );

    if (reversedConnection) {
      reversedConnection.bidirectional = true;
      return prev.concat({
        ...connection,
        isInverseEdge: true
      });
    }

    return prev.concat(connection);
  }, []);

  // Put everything together in elements, with everything in the "data" property
  const elements = [...dedupedConnections, ...dedupedNodes].map(element => ({
    data: element
  }));

  return { elements };
}
