import {
  typeCheck,
  getReturnResultList,
  formatField,
  formatType,
  getTypeFields,
  getQueryType,
  getTypeByName
} from '../../utils/index';

export default {
  toQueryResolver(introspection, resolvers) {
    const list = [
      {
        key: 'pass',
        pass: true,
        message: 'expected Query is be defined'
      },
      {
        key: 'fail',
        message: 'unexpected Query is be undefined'
      },
      {
        key: 'notFound',
        message: 'not found Query Reslover'
      },
      {
        key: 'resolverType',
        message: 'unexpect Query Reslover type is Error'
      },
      {
        key: 'resolverArgs',
        message: 'unexpect Query Reslover args is Error'
      },
      {
        key: 'resolverArgsName',
        message: 'unexpect Query Reslover args Name is Error'
      },
      {
        key: 'resolverArgsType',
        message: 'unexpect Query Reslover args Type is Error'
      }
    ];
    const result = getReturnResultList(list);
    const queryType = getQueryType(introspection);
    if (!queryType) {
      return result['fail'];
    }
    const schemaResolvers = getTypeFields(introspection, queryType.name);
    if (!schemaResolvers || !schemaResolvers.length) {
      return result['fail'];
    }
    if (!resolvers || !Array.isArray(resolvers)) {
      return result['notFound'];
    }

    for (let { resolver, type, args } of resolvers) {
      resolver = formatType(resolver);
      const schemaResolver = getTypeByName(schemaResolvers, resolver);
      if (!schemaResolver) {
        return result['notFound'];
      }

      // type
      type = formatType(type);
      if (!typeCheck(type, schemaResolver.type)) {
        return result['resolverType'];
      }

      // args
      if (Array.isArray(args)) {
        args = args.filter(a => a.fieldName);
      } else {
        if (typeof args !== 'object') {
          return result['resolverArgs'];
        }
        args = Object.keys(args)
          .map(argKey => formatField(argKey, args[argKey]))
          .filter(e => e);
      }
      if (schemaResolver.args.length !== args.length) {
        return result['resolverArgs'];
      }
      if (args.length > 0) {
        const argsMap = new Map(schemaResolver.args.map(a => [a.name, a]));
        for (const arg of args) {
          const rArg = argsMap.get(arg.fieldName);
          if (!rArg) {
            return result['resolverArgsName'];
          }
          if (arg.type) {
            if (!typeCheck(arg.type, rArg.type)) {
              return result['resolverArgsType'];
            }
          }
        }
      }
    }
    return result['pass'];
  }
};
