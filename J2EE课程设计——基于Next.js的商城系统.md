# J2EE课程设计——基于Next.js（SSR）的商城系统

### 一、课程设计目的

* 熟练掌握React + TypeScript开发
* 学习新知识Next.js
* 针对刚学习的Webpack、Babel进行实现
* 针对刚学习的Node.js进行实践

### 二、课程设计内容

利用Next.js框架针对实验三的商城系统进行改造：

* 对项目进行一定程度上的重构
* 针对登录鉴权、查看详情、加入购物车功能进行优化
* 新增简单的注册、搜索、评论功能

### 三、课程设计过程

#### (一)功能：

##### ==1、对通用的api / 函数进行封装==

* ###### 对Api Route进行封装

  * 为什么要封装？

    * Next.js没有像Express、Koa一样的中间件技术。

    * 对Api route 错误没有统一的处理，开发效率低

  * 为什么需要中间件？

    1、我们可以在req对象中注入一些属性，可以被下一个中间件拿到

    2、可以通过不执行next()来中止请求，同时修改res的属性来改变response的状态

    因此有中间件，就可以让代码在不同路由之间重用。

  * 结合hapi/boom、next-connect对ApiRoute进行封装

  ![image-20230117204437584](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117204437584.png)

* ###### 实现单例prisma

  由于Next.js开发环境下会进行热更新，所以prisma会不断生成实例。故需要实现一个单例

![image-20230117204545293](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117204545293.png)

##### ==2、注册==

* （==注册、登录、鉴权==）目的：

  * 学会Prisma的基本使用
  * 学会react-query的基本使用
  * 学会prisma的基本使用
  * 对密码需要进行加密存储
  * 在Next.js中使用JWT、cookie保存用户登录状态
  * 如何实现保护页面只允许登录用户访问（鉴权）

* 创建账号——具体实现过程：

  * 先对prisma进行配置

  * 后端：实现创建账号的接口，==利用bcrypt实现对密码进行加密存储==

  * 前端调用创建账号的接口

    核心代码：

    ```react
    //后端
    export default apiHandler().post(async (req: NextApiRequest,  res: NextApiResponse) => {
        const body = req.body as {
          username: string,
          password: string
        }
        const created = await prisma.user.create({
          data: {
            USERNAME: body.username,
            PWD: bcrypt.hashSync(body.password, 10)
          }
        })
        res.json({
          message: 'success'
        })
      })
    
    //前端
      const username = useRef(null);
      const password = useRef(null);
      const loginMutation = useMutation(login);
    
      async function login({ username, password }) {
        const res = await axios.post("api/user/login", {
          username,
          password,
        });
        if (res.status === 200) message.success(`登录成功`);
        location.href = "/index";
      }
      function onClickLogin() {
        const usernameValue = username.current?.value;
        const passwordValue = password.current?.value;
        loginMutation.mutate({ username: usernameValue, password: passwordValue });
      }
    ```

  * 结果展示（因为本课程设计目的是学习新知识，所以没有在页面美化上花时间）：

    ![image-20230117205444217](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117205444217.png)

    ![image-20230117205706959](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117205706959.png)

##### ==3、登录==

* 登录——具体实现过程：

  * 后端：实现验证用户名和密码的接口
  * 前端：对接口进行适配，进行联调。对返回来的信息进行展示
  * 配置密钥，生成JWT，将token存储在httpOnly的cookies中

  核心代码：

  ```react
  //验证用户名和密码
  async function validate(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        USERNAME: username,
      },
  
    });
    if (!user) {
      throw Boom.unauthorized("user not found");
    }
    if (bcrypt.compareSync(password, user.PWD)) {
      return user
    } else {
      throw Boom.unauthorized('username or password not correct')
    }
  }
  //生成并保存token
  export default apiHandler()
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
       const body = req.body as {
         username: string;
         password: string;
       };
        //验证用户名和密码
        const user = await validate(body.username, body.password)
        //生成token
        const token = jwt.sign({
            username: user.USERNAME
        }, process.env.JWT_SECRET as Secret, { expiresIn: '3 days' })
        
        //保存在httpOnly，之后所有请求都会带上这个cookie——token
        res.setHeader("Set-Cookie", cookie.serialize('token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 3
              }));
      res.json({})
    })
  ```

  * 结果展示：

  ![image-20230117211020234](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117211020234.png)

  ![image-20230117211056739](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117211056739.png)

##### ==4、鉴权==

* 实现鉴权——具体实现过程

  * 通过Next.js提供的getServerSideProps，在访问页面之前先拿到token
  * 实现取token，并验证token的方法

  核心代码：

  ```react
  //访问购物车界面之前进行判断
  export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const user = await getUserFromReq(ctx.req);
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }
    return {
      props: {
        user: {
          name: user.USERNAME,
        },
      },
    };
  };
  
  //验证token
  export const getUserFromReq = async (req: NextApiRequest) => {
    const token = req.cookies['token']
    if (!token) return null
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as Secret)
      if((typeof(payload) === 'string'))return null 
      const user = await prisma.user.findUnique({
        where: {
          USERNAME: payload.username
        }
      })
      return user
    }
    catch (e) {
      return null
    }
  }
  
  ```

  * 结果展示：

    带token情况下：可以直接访问

    不带token情况下：![image-20230117211204103](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117211204103.png)

##### ==5、退出登录==

* 退出登录——具体实现

  * 创建一个接口，将cookies中的token设置为不合法的值
  * 不合法的值无法通过验证，即可实现退出登录

  核心代码：

  ```react
  export default apiHandler().get(async (req, res) => {
      res.setHeader('Set-Cookie', cookie.serialize('token', 'invalid', {
          httpOnly: true,
          path: '/'
      }))
      res.redirect('/login')
  })
  ```

  结果验证：

  ![image-20230117211420144](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117211420144.png)

  ![image-20230117211443112](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230117211443112.png)

  

##### ==6、商品列表跳转到详情页面==

代码思路：通过动态路由，写一个页面，传不同的id渲染成不同路由的页面

程序设计：

* 先编写接口，从数据库获取真实的数据，利用SSR，先获取数据，再进行渲染

  ```react
  //接口
  export default apiHandler().get(async (req: NextApiRequest, res: NextApiResponse) => {
    const list = await prisma.goods.findMany()
      res.json({
        list
      })
  }) 
  ```

  ```react
  //获取数据
  export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const res = await fetch("http://localhost:3000/api/good/list");
    const goodsList = await res.json();
    return {
      props: {
        data: goodsList,
      },
    };
  };
  ```

* 根据ID，利用动态路由，跳转到对应的界面

  * 动态路由定义

  ![image-20230119130358350](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119130358350.png)

  * 传参

  ![image-20230119130748381](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119130748381.png)

  * 获取数据

  ```react
  //拿到对应的id，在渲染页面前先加载数据
  export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { pid } = ctx.query;
    console.log(pid);
    const goodDetail = await axios.post(`${base_URL}/api/good/detail`, {
      id: pid,
    });
    if (!goodDetail.data?.length) return { props: {} };
    return {
      props: {
        data: goodDetail.data.detail[0],
      },
    };
  };
  ```

* 结果展示

![image-20230119130235772](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119130235772.png)

![image-20230119130215374](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119130215374.png)

![image-20230119130317277](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119130317277.png)



##### ==7、加入购物车跳转到对应购物车界面==

代码思路：将数据添加到数据库中，跳转到购物车页面，查询该账号目前购物车的数据（简单的实现）

* 添加到数据库

  ```react
  export default apiHandler().post(async (req: NextApiRequest, res: NextApiResponse) => {
    
      const body = req.body as {
        username: string,
        goodIds: string
      }
      const created = await prisma.shopCart.create({
        data: {
          // id: '4',
          username: body.username,
          goodIds: body.goodIds
        }
      })
      res.json({
        message: 'success'
      })
    })
  ```

  

* 查询账号目前的购物车的数据（通过id再去查对应商品详情）
  ```react
   const res = await axios.post(`${base_URL}/api/good/cart`, {
      username: user.USERNAME,
    });
    const list = res.data.list;
    const promises = [];
    if (list?.length) {
      list.forEach((element: { goodIds: any }) => {
        promises.push(
          axios.post(`${base_URL}/api/good/detail`, {
            id: element.goodIds,
          })
        );
      });
    }
    const detailList = [];
    const detailData = await Promise.all(promises);
    detailData.forEach((item, index) => {
      detailList.push(item.data.detail[0]);
    });
  ```

  

![image-20230119174035087](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119174035087.png)

##### ==8、商品搜索==

从前端的角度审视该功能要点：

* 防抖节流——提高性能
* 实时根据关键词提供可能搜的内容

核心代码：

```react
//防抖的具体实现
export function debounce(fn: Function, ms: number) {  //fn:要防抖的函数 ms:时间
    let timerId // 创建一个标记用来存放定时器的返回值
    return function () {
        timerId && clearTimeout(timerId) // 每当用户输入的时候把前一个 setTimeout clear 掉
        timerId = setTimeout(() => { 
            fn.apply(this, arguments)
        }, ms)
    }
}
//调用antd组件库，再对样式进行改造，封装成组件
<SearchInput
            placeholder="关键词"
            style={{ width: 375, border: "1px solid red", borderRadius: 6 }}
/>
//具体代码在components/SearchInput.tsx
```

实际项目采用antd的搜索框更加高效简洁。可以通过自定义CSS样式进行改造

==由于数据库缺乏数据，所以调用了淘宝的数据接口来展示数据==

结果展示

![image-20230119182115182](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230119182115182.png)

##### ==9、配置404和500界面==

![image-20230120164719390](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230120164719390.png)

#### (二)项目打包

* 利用webpack、Babel进行打包

  * 设置缓存。缓存缩短了响应时间并减少了对外部服务的请求数。
    ![image-20230120164204838](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230120164204838.png)

    

  * 减少JavaScript的大小

    通过webpack捆绑器来查看JavaScript文件的大小

    以下是next.config.js的配置

    ```js
    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    });
    module.exports = withBundleAnalyzer({});
    ```

  * 利用next自带的build构建（底层利用webpack实现）

    ![image-20230120164854848](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230120164854848.png)

    如果需要，也可以针对一些配置条件进行自定义配置

#### (三)利用工具链提高代码质量

​		1、ESLint

使用默认配置。代码检查工具，用来检测代码是否符合规范

![image-20230118213916365](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230118213916365.png)

​		2、lint-staged

针对tsx、ts进行简单配置。主要用于在git add之前对代码进行格式化，和查找错误并进行修复
	![image-20230118213841402](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230118213841402.png)

​		3、commitLint

规范 git commit的格式

​		4、prettier

对项目的代码进行格式化

#### (四)原本前端模板代码中存在一些已经被遗弃的用法

![image-20230115004941963](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230115004941963.png)

![image-20230115005014507](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230115005014507.png)

#### (五)存在多处潜在的bug

​	1、对获取的dom元素没有进行判断便直接调用

修改：增加判断条件，防止出现bug，获取不到该DOM元素的情况下影响网页正常使用

![image-20230115160248818](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230115160248818.png)

​	2、类名错误

修改，将其修改成“clear”

![image-20230115171836525](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230115171836525.png)

#### (六)开发过程中遇到的问题

##### (一)获取不到资源

迁移代码时，根据平时拼写的路径无法读取到图片，原因是next是运行在服务器上的框架，对此进行了特殊的配置，静态资源需要放在public下。[静态资源部署](https://www.nextjs.cn/docs/basic-features/static-file-serving)

![image-20230115011148356](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230115011148356.png)

==解决==：书写成符合Next.js的路径

```react
src="/images/payment_a.jpg"
```

在渲染页面之前利用getServerSideProps时调用接口，拿不到数据。

![image-20230118225659524](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230118225659524.png)

==解决==：

* 通过postman调接口，发现可以拿到数据，证明后端大概率没问题
* 需要注意 `getServerSideProps` 为 `node server` 端代码，无法在其中直接请求内部 `API`，因为会找不到地址，所以需要写全地址
* 对该函数代码排查，发现调用接口的结果需要进行json()转格式，才能使用

之所以花了一些时间排查的原因：

getServerSideProps虽然是在前端页面写的代码，实际上执行是在服务器执行（SSR），在服务器渲染之前调用接口，故前端网络无法检测到list请求

##### (二)连接数据库

对Next.js不熟悉，连接数据库出现错误，网络上这方面生态还不够丰富，有些问题报错查找不到文章博客

==解决==：通过对代码进行注释，报错信息进行排查，结合Next.js官方文档和prisma官方连接mysql的用例解决

##### (三)接口返回格式不统一

Next.js调用接口返回的数据格式不统一，需要对接口请求进行统一格式

==解决==：通过前文提到的对api / 函数进行封装，使接口返回的状态码，数据等一致，提高开发效率

##### (四)返回的数据不正常

![image-20230118232024790](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230118232024790.png)

![image-20230118231439711](C:\Users\86177\AppData\Roaming\Typora\typora-user-images\image-20230118231439711.png)

原因：原理与0.1+0.2不等于0.3类似，IEE 754规范，二进制无法完整表达一些小数，只能采用近似数，两个近似数相加固然是一个近似数

==解决==：通过==toFixed==四舍五入保留两位小数解决

### 四、知识点记录

#### （一）Next.js

1、Next.js是什么？

NextJs 是一款 React 开发框架，主要关注两点：

- 为生产环境所准备：无需复杂配置即可提供升级环境所需的各种功能
- 提供良好的开发者体验(DX)

通过 Next.js 框架开发的 React 应用无需配置就可以如服务端渲染 SSR、编译时渲染 SSG，Typescript 语言支持，自动打包，路由愈加载等功能。

2、为什么选用Next.js

==在1月12号的字节青训营上，听到Next.js这个实现服务端渲染的框架，于是想通过这个课程设计，收获一些新的知识，于是选用Next.js来开发。==

* Next.js的优势：

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f7f95900c094b059b2502f3e1bf48fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

  * ==支持服务端渲染（ Server Side Render）== 上图借鉴他人博客
    * 优点：能够提高网页的SEO和首屏渲染速度
    * 缺点：增大了服务器开销
  * 支持客户端导航
    * 页面切换使用JavaScript进行，比浏览器默认的导航\<a>快
  * 代码拆分和预取
    * 每个页面只需要加载该页面所需要的内容，所以呈现主页的时候不需要提供其他页面的代码，尽管页面很多的情况下，==主页也能很快加载==。
    * 如果某个页面发生错误，也不影响其他页面正常工作
    * 支持CSS模块，确保为每个页面加载最少量的CSS

#### （二）一些新学到的库

1、styled-jsx

​	一个将CSS写在JavaScript 里面的库，引入它，允许在React组件中编写CSS，并且CSS样式会被限定范围

2、classnames

​	能够简单地进行类名切换

```
<div
      className={cn({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error'
      })}
    >
```

3、react-query

​	该库封装好请求（get、post、put等等）的钩子

4、next-connect

​	能在Next.js中像Express/Koa一样编写中间件

在 Next.js, 无论你在 API route 中 throw 一个怎样的 error, 它都会响应一个 `500 Internal Server Error`. 并且你根本没有方法统一处理这些 error.

使用 `next-connect` 的所有 api route 或中间件，如果抛出异常，都可以在 `onError` 中捕获到：

5、cors

​	修改跨域设置

6、hapi

​	提供了很多 helper 用于抛出 HTTP 异常

7、Prisma

​	对TypeScript 友好的 Node.js ORM

8、jsonwebtoken

​	用来生成JWT，提供了签名、验证等一系列方法

### 五、课程设计总结

github地址：

本次课程设计难度更多是在于全新的知识。

包括在此次课程设计之前从未接触过的Next.js(SSR/SSG)开发，从是什么，为什么，怎么做这三方面进行学习Next.js。除此之外，基于Next.js去开发一个项目，需要使用到React+TS进行开发前端，Node.js开发后端，利用webpack、babel等刚学习的知识进行打包编译。

整个课程设计下来收获非常多，主要在以下这些方面：

* 理解Next.js的简单原理，优势，应用场景，具体的使用
* 学会Node.js开发基本的后端接口
* 理解浏览器和node.js运行JavaScript的内核差异
* 学会Prisma的基本使用
* 学会react-query的基本使用
* 对密码需要进行加密存储
* 在Next.js中使用JWT、cookie保存用户登录状态
* 如何实现保护页面只允许登录用户访问（鉴权）
* 对防抖节流的具体应用
* 了解了一些库，知道他们的作用，并有简单的使用

==因为时间和技术问题，目前项目存在许多的不足之处==：

* 只是对部分功能进行改造，并不完善。
* 数据库的设计也并不合理，一个电商系统存在许多值得打磨的地方
* 很多typescript应该去定义的类型没有定义

