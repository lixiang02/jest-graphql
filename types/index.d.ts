/// <reference types="jest" />

declare namespace jest {
  interface ResolverArg {
    fieldName: String
    type: String | Function | Object
  }
  interface ResolverParam {
    resolver: String | Function | Object
    type: String | Function | Object
    args: Object | Array<ResolverArg>
  }

  interface Matchers<R> {
    /**
     *
     * @param {String} introspection
     * @param {[ResolverParam]} resolvers
     */
    toQueryResolver(introspection: string, resolvers: [ResolverParam]): R;

    /**
     *
     * @param {String} introspection
     * @param {String | Function | Object} type
     * @param {Object} fields
     */
    toTypeFields(introspection: string, type: String | Function | Object, fields: Object): R;

    /**
     *
     * @param {String} introspection
     * @param {String | Function | Object} type
     * @param {Number} expectLength
     */
    toTypeChildLen(introspection: string, type: String | Function | Object, expectLength: Number): R;
  }

  interface Expect {
        /**
     *
     * @param {String} introspection
     * @param {[ResolverParam]} resolvers
     */
    toQueryResolver(introspection: string, resolvers: [ResolverParam]): any;

    /**
     *
     * @param {String} introspection
     * @param {String | Function | Object} type
     * @param {Object} fields
     */
    toTypeFields(introspection: string, type: String | Function | Object, fields: Object): any;

    /**
     *
     * @param {String} introspection
     * @param {String | Function | Object} type
     * @param {Number} expectLength
     */
    toTypeChildLen(introspection: string, type: String | Function | Object, expectLength: Number): any;
  }
}
