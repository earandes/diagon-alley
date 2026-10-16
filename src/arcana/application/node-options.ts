import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import type { NodeKind } from '../domain/exploration/route';
import type { NodeOptions } from './run-contracts';
/** Shared by durable transport, authority and persisted receipt validation. */
export function nodeOptionsSnapshot(value: unknown, kind?: NodeKind): NodeOptions {
  const options = value as NodeOptions;
  if (
    !options ||
    typeof options !== 'object' ||
    (options.refugeAction !== undefined && !['heal', 'focus'].includes(options.refugeAction)) ||
    (options.pactAction !== undefined && !['recruit', 'pass'].includes(options.pactAction)) ||
    (options.encounterAction !== undefined &&
      !['risk', 'pass'].includes(options.encounterAction)) ||
    (options.replaceUnitId !== undefined &&
      (!validDomainId(options.replaceUnitId) || options.pactAction === 'pass')) ||
    [options.refugeAction, options.pactAction, options.encounterAction].filter(
      (v) => v !== undefined,
    ).length > 1 ||
    (kind !== undefined &&
      ((options.refugeAction !== undefined && kind !== 'refuge') ||
        ((options.pactAction !== undefined || options.replaceUnitId !== undefined) &&
          kind !== 'pact') ||
        (options.encounterAction !== undefined && kind !== 'encounter')))
  )
    throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({
    ...(options.refugeAction === undefined ? {} : { refugeAction: options.refugeAction }),
    ...(options.pactAction === undefined ? {} : { pactAction: options.pactAction }),
    ...(options.replaceUnitId === undefined ? {} : { replaceUnitId: options.replaceUnitId }),
    ...(options.encounterAction === undefined ? {} : { encounterAction: options.encounterAction }),
  });
}
