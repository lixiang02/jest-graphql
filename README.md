## 技术文档

### 项目描述

    该项目是 Jest 的 expect 的方法扩展，目前只包括针对 typedgraphql 中对 Query 的 Resolver 和 Query 的 Type 的 Fields 的单元测试

### 设计思想

    因为 typed-graphql 的单元测试太过于复杂，所以为了简化对 Resolver 和 Type 的测试，设计了这个项目，原理就是通过 graphql 中内省系统中获取内省树的方法函数（getIntrospectionQuery()）为对照基础,比较 Query 的 Resolver 和每一个用到的 Type 的 Fields 

### 现有不足

1. 扩展方法数量较少
2. 强依赖`graphql`的`getIntrospectionQuery`方法返回的树形数据，如果返回数据格式发生变化可能会导致扩展方法结果异常

### 改进建议

1. 补全`Mutation`的相关类的测试
2. 补全`Type`中除了`fields`数据，其他种类对象的验证函数
3. 可以增加其他`JEST`的扩展函数，不必局限于针对`Graphql`
4. 补全`utils`中用到的函数的单元测试

---

## 该项目是基于jest-extended 开发有助于typedgraphql的单元测试扩展工具

具体用法 请参考: https://github.com/lixiang02/jest-extended

---

## 接口文档

#### 扩展方法

> toQueryResolver 验证QueryResolver中的方法

方法参数:

- **`introspection`**(*`String`*) : `Graphql`通过`getIntrospectionQuery`函数生成的内省树字符串
- **`resolvers`**(*`[ResolverParam]`*): `typedGraphQL`中创建的`Resolver`列表，用于对比内省数据

**ResolverParam**:
- **`resolver`**(*`String`* | *`Function`* | *`Object`*): `Resolver`的名称或类对象
- **`type`**(*`String`* | *`Function`* | *`Object`*): `Resolver`的`Query`类型名称活着类对象
- **`args`**(*`Object`* | *`Array<ResolverArg>`*): `ResolverQuery`函数的参数对象或数组对象，用于对比内省数据

**ResolverArg**:
- **`fieldName`**(*`String`*): 参数名称
- **`type`**(*`String`* | *`Function`* | *`Object`*): 参数类型

> toTypeChildLen 验证指定的类型的Fields的数量

方法参数：

- **`introspection`**(*`String`*) : `Graphql`通过`getIntrospectionQuery`函数生成的内省树字符串
- **`type`**(*`String`* | *`Function`* | *`Object`*): 指定类型
- **`expectLength`**(*`Number`*): 指定类型的`Fields`的数量

> toTypeFields 验证指定类型的`Field`的属性名称和类型

方法参数：

- **`introspection`**(*`String`*) : `Graphql`通过`getIntrospectionQuery`函数生成的内省树字符串
- **`type`**(*`String`* | *`Function`* | *`Object`*): 指定类型
- **`fields`**(*`Object`*): 指定类型的`Fields`

### 写法对比

#### 之前写法

之前写法的注意思想就是，生成shcema然后根据schema结构，解析对应的Resolver数据结构、类型、参数的准确性
要求开发人员准确的了解schema的结构，开发门槛高效率差

```js
const schema = buildSchemaSync(Resolver)
const types = schema._introspection.data.type
const QueryType = types.find(e => e.name === 'centrics')
expect(types.length).toEquel(6)
expect(QueryType).toBeDefined()
...

```

#### 当前写法

当前扩展函数，隐藏了schema的结构，使开发人员专注于Resolver的类型、参数等的正确性的开发
开发门槛低、开发效率高

```js
expect(introspection).toQueryResolver([
    {
        resolver: instantiate.centrics,
        type: [Centric],
        args: []
    },
    {
        resolver: instantiate.centricTop,
        type: [Centric],
        args: {
            top: Number
        }
    }
]);
```