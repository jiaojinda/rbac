# rbac
nodejs实现简单基于角色的资源管理

连接mongodb数据库  首次使用请执行127.0.0.1:3000/init方法

@DONE
* user/role/menu三个模块的维护
* 数据库操作抽象到工具类
* 修改menu的list方式为结构树
* user分配role (预想:左右选择框)
* role分配menu (预想:结构树checkbox)
* 数据库配置提到配置文件

@DOING
* 删除数据时连带删除关联表数据 并做事务的捆绑

@TODO
* 登陆记录session或cookie
* 拦截器
* RESTful
