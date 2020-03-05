const GRAPHQL_TYPE = {
  Int: 'Int',
  Float: 'Float',
  SCALAR: 'SCALAR',
  LIST: 'LIST'
};
// 扩展
expect.extend({
  toTypeChildLen(introspection, type, expectLength = 0) {
    const result = getReturnResultList([
      {
        key: 'pass',
        pass: true,
        message: 'expected type field length is correct'
      },
      {
        key: 'fail',
        pass: false,
        message: 'unexpected type field length is incorrect'
      }
    ]);
    type = formatType(type);
    const fieldsLen = getTypeFieldsLen(introspection, type);
    if (fieldsLen === Math.round(Number(expectLength))) {
      return result['pass'];
    }

    return result['fail'];
  },

  toTypeFields(introspection, type, fields) {
    const list = [
      {
        key: 'pass',
        pass: true,
        message: 'expected type field is correct'
      },
      {
        key: 'fail',
        message: 'unexpected type field is incorrect'
      },
      {
        key: 'typeNotFound',
        message: 'unexpected type is not found'
      },
      {
        key: 'fieldsNotFound',
        message: 'unexpected fields is not found'
      },
      {
        key: 'fieldSchemaNotFound',
        message: 'unexpected field schema is not found'
      },
      {
        key: 'schemaNotFound',
        message: 'unexpected field schema is not found'
      },
      {
        key: 'fieldParamsError',
        message: 'unexpected fields params is error'
      },
      {
        key: 'fieldParamsNotFound',
        message: 'unexpected fields params is not found'
      },
      {
        key: 'fieldTypeisError',
        message: 'unexpected field type is error'
      }
    ];
    const result = getReturnResultList(list);

    // type
    type = formatType(type);
    if (!type) {
      return result['typeNotFound'];
    }

    // types
    const schemaType = getType(introspection, type);
    if (!schemaType) {
      return result['schemaNotFound'];
    }

    // fields
    fields = Object.keys(fields)
      .map(fieldKey => formatField(fieldKey, fields[fieldKey]))
      .filter(e => e);
    if (!fields) {
      return result['fieldsNotFound'];
    }

    for (let field of fields) {
      const fieldName = field.name || field.fieldName;
      const fieldType = field.type || field.fieldType;
      const fieldSchema = getField(introspection, type, fieldName);
      if (!fieldSchema) {
        return result['fieldSchemaNotFound'];
      } else if (!fieldName || !fieldType) {
        return result['fieldParamsNotFound'];
      }
      if (!typeCheck(fieldType, fieldSchema.type)) {
        return result['fieldTypeisError'];
      }
    }
    return result['pass'];
  },

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
    for (let { queryName, type, args } of resolvers) {
      queryName = formatType(queryName);
      const resolver = getTypeByName(schemaResolvers, queryName);
      if (!resolver) {
        return result['notFound'];
      }

      // type
      type = formatType(type);
      if (!typeCheck(type, resolver.type)) {
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
      if (resolver.args.length !== args.length) {
        return result['resolverArgs'];
      }
      if (args.length > 0) {
        const argsMap = new Map(resolver.args.map(a => [a.name, a]));
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
});

function typeCheck(type, schmaType) {
  const typeKey = String(type).toLowerCase();
  schmaType = removeNotNull(schmaType);
  switch (typeKey) {
    case 'number':
    case 'float':
      if (!schmaType || schmaType.name !== GRAPHQL_TYPE.Float || schmaType.kind !== GRAPHQL_TYPE.SCALAR) {
        return false;
      }
      break;
    case 'int':
      if (!schmaType || schmaType.name !== GRAPHQL_TYPE.Int || schmaType.kind !== GRAPHQL_TYPE.SCALAR) {
        return false;
      }
      break;
    case 'string':
    case 'boolean':
      if (!schmaType || String(schmaType.name).toLowerCase() !== typeKey || schmaType.kind !== GRAPHQL_TYPE.SCALAR) {
        return false;
      }
      break;
    // eslint-disable-next-line no-case-declarations
    default:
      const leftIndex = type.indexOf('[');
      const rightIndex = type.indexOf(']');
      if (leftIndex !== -1 && rightIndex !== -1 && leftIndex < rightIndex) {
        // LIST
        if (!schmaType || schmaType.kind !== 'LIST') {
          return false;
        }
      } else {
        // CUSTOM
        if (type !== schmaType.name) {
          return false;
        }
      }

      // custom

      break;
  }
  return true;
}

function removeNotNull(type) {
  if (type.kind === 'NON_NULL' && !type.name) {
    type = type.ofType;
  }
  return type;
}

function getReturnResultList(list) {
  const result = {};
  for (const { key = '', pass = false, message = '' } of list) {
    if ((key && message && typeof key === 'string', typeof pass === 'boolean' && typeof message === 'string')) {
      result[key] = {
        pass,
        message: () => message
      };
    }
  }

  return result;
}

function formatField(fieldName, type) {
  const result = { fieldName, type };

  if (result.type.fieldName && typeof result.type.fieldName === 'string') {
    result.fieldName = result.type.fieldName;
  }

  // type
  if (result.type.type) {
    result.type = result.type.type;
  }
  result.type = formatType(result.type);
  return result;
}

function formatType(type) {
  if (type && typeof type !== 'string') {
    if (type.name) {
      type = type.name;
    }
    if (Array.isArray(type) && type.length === 1 && type[0].name) {
      if (typeof type[0] !== 'string') {
        type = type[0].name.concat('[]');
      } else {
        type = type[0];
      }
    }
  }
  return type;
}

function getSchema(introspection) {
  if (introspection && introspection.data && introspection.data.__schema) {
    return introspection.data.__schema;
  }
  return null;
}

function getSchemaTypes(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.types) {
    return schema.types;
  }
  return null;
}

function getType(introspection, typeName) {
  if (introspection) {
    return getTypeByName(getSchemaTypes(introspection), typeName);
  }
  return null;
}

function getTypeFields(introspection, typeName) {
  return (getType(introspection, typeName) || {}).fields;
}

function getTypeFieldsLen(introspection, typeName) {
  const fields = getTypeFields(introspection, typeName);
  let len = 0;
  if (fields && fields.length) {
    len = fields.length;
  }
  return len;
}

function getField(introspection, typeName, fieldName) {
  return getTypeByName(getTypeFields(introspection, typeName), fieldName);
}

function getQueryType(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.queryType) {
    return schema.queryType;
  }
  return null;
}

function getMutationType(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.mutationType) {
    return schema.mutationType;
  }
  return null;
}

function getSubscriptionType(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.subscriptionType) {
    return schema.subscriptionType;
  }
  return null;
}

function getDirectives(introspection) {
  const schema = getSchema(introspection);
  if (schema && schema.directives) {
    return schema.directives;
  }
  return null;
}

function getTypeByName(list = [], itemName = '') {
  if (Array.isArray(list) && typeof itemName === 'string') {
    return list.find(item => item.name === itemName);
  }
  return null;
}

function initResolver(Resolver) {
  return new Resolver();
}

module.exports = {
  getField,
  getTypeFields,
  getType,
  initResolver,
  getSchema,
  getSchemaTypes,
  getQueryType,
  getMutationType,
  getSubscriptionType,
  getDirectives,
  getTypeByName
};
