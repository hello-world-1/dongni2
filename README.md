## 后台接口
### 用户使用账号登录
> * /user/login

> * Input Parameters
>> * username:requested
>> * password:requested

> * Successful Return
>> * {如果为管理员登录跳转到管理员后台界面,如果为老师登录跳转到老师后台界面)

> * Error Return
>> * errcode = 1: 账号不存在
>> * errcode = 2: 密码不正确

> * example

```
如果为管理员跳转传送的数据为:
{
  "status": "success",
  "teachers": [{
    "_id": "58184fe203775a8f0fd1b096",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	  "age": "30",
	  "sex": "male"
  },......]
}
如果为老师登录跳转传送的数据为:
{
  "status": "success",
  "teacher": {
    "_id": "58184fe203775a8f0fd1b096",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	  "age": "30",
	  "sex": "male"
  }
}
```
### 管理员添加老师
> * /admin/addteacher

> * Input Parameters
>> * username:requested
>> * password:requested
>> * avatar:requested
>> * introduction:requested
>> * name:requested
>> * age:requested
>> * sex:requested

> * Successful Return
>> * {跳转到管理员首页)

> * Error Return
>> * errcode = 1: 用户名已存在
>> * errcode = 2: 服务器内部错误

> * example

```
跳转到管理员首页传送的数据为:
{
  "status": "success",
  "teachers": [{
    "_id": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	  "age": "30",
	  "sex": "male"
  },......]
}
跳转到重新添加老师界面传送的数据为:
{status:'error','errcode':1}
```
### 注销登录
> * /user/logout

> * Input Parameters

> * Successful Return
跳转到登录界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example
```
{"status":"success"}
```
### 老师修改头像:只有登录的老师自己可以修改
> * /teacher/changeavatar

> * Input Parameters
>> * file.name:requested
>> * file.path:requested

> * Successful Return
跳转到老师个人信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到老师个人信息界面传送的数据为:
{
  "status": "success",
  "teacher": {
    "_id": "58184fe203775a8f0fd1b096",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	"age": "30",
	"sex": "male"
  }
}
{status:'error','errcode':1}
```
### 修改老师个人信息:只有登录的老师自己可以修改
> * /teacher/changeinfo

> * Input Parameters
>> * description:requested
>> * password:requested
>> * sex:requested
>> * introduction:requested
>> * name:requested
>> * age:requested
>> * avatar:requested

> * Successful Return
跳转到老师个人信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到老师个人信息界面传送的数据为:
{
  "status": "success",
  "teacher": {
   "_id": "58184fe203775a8f0fd1b096",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	  "age": "30",
	  "sex": "male"
  }
}
```

### 当前老师添加过的所有图书
> * /teacher/booklist

> * Input Parameters
>> * teacherID:requested

> * Successful Return
跳转到老师添加过的所有图书界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到老师添加过的所有图书界面传送的数据为:
{
  "status": "success",
  "books": [{
    "_id": "58184fe203775a8f0fd1b096",
	  "teacherID": "fsde4fe203775a8f0fd14323",
    "title": "标题",
    "author": "作者张三",
    "publishHouse": "出版社",
    "introduction": "内容简介",
	  "purchaseLink": "购买链接"
  },......]
}
{status:'error','errcode':1}
```
### 图书的详细信息
> * /teacher/bookdetail

> * Input Parameters

> * Successful Return
跳转到图书的详细信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到图书的详细信息界面传送的数据为:
{
  "status": "success",
  "book": {
    "_id": "58184fe203775a8f0fd1b096",
	  "teacherID": "fsde4fe203775a8f0fd14323",
    "title": "标题",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "author": "作者张三",
    "publishHouse": "出版社",
    "introduction": "内容简介",
	  "purchaseLink": "购买链接"
  },
  "teacher": {
    "_id": "fsde4fe203775a8f0fd14323",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	  "age": "30",
	  "sex": "male"
  }
}
```
### 老师添加图书
> * /teacher/addbook

> * Input Parameters
>> * teacherID:requested
>> * title:requested
>> * publishHouse:requested
>> * introduction:requested
>> * purchaseLink:requested

> * Successful Return
跳转老师添加过的所有图书界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到老师添加过的所有图书界面传送的数据为:
{
  "status": "success",
  "books": [{
    "_id": "58184fe203775a8f0fd1b096",
	  "teacherID": "fsde4fe203775a8f0fd14323",
    "title": "标题",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "author": "作者张三",
    "publishHouse": "出版社",
    "introduction": "内容简介",
	  "purchaseLink": "购买链接"
  },......]
}
```
### 当前老师添加过的所有课程
> * /teacher/lessonlist

> * Input Parameters

> * Successful Return
跳转到老师添加过的所有课程界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到老师添加过的所有课程界面传送的数据为:
{
  "status": "success",
  "lessons": [{
    "_id": "58184fe203775a8f0fd1b096",
    "teacherID": "fsde4fe203775a8f0fd14323",
    "description": "课程描述",
    "teacherName": "开课老师",
    "startDate": "课程开始时间",//日期的格式为2010-10-20 4:30:00
    "endDate": "课程结束时间",
    "classTime": "上课时间",
    "enrolldeadline": "报名截止日期",
    "studentsLimit": "限制人数",
    "classHours": "课程周期",
    "telephone": "联系方式",
    "price": "课程价格",
    "enrollNum": "已报名人数",
    "state": "课程状态"
  },......]
}
```
### 课程的详细信息
> * /teacher/lessondetail

> * Input Parameters
>> * _id:requested

> * Successful Return
跳转到课程的详细信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到课程的详细信息界面传送的数据为:
{
  "status": "success",
  "lesson": {
    "_id": "58184fe203775a8f0fd1b096",
	  "teacherID": "fsde4fe203775a8f0fd14323",
    "description": "课程描述",
    "teacherName": "开课老师",
    "startDate": "课程开始时间",
    "endDate": "课程结束时间",
    "classTime": "上课时间",
	  "enrolldeadline": "报名截止日期",
	  "studentsLimit": "限制人数",
	  "classHours": "课程周期",
	  "telephone": "联系方式",
	  "price": "课程价格",
	  "enrollNum": "已报名人数",
	  "state": "课程状态"
  },
  "teacher": {
    "_id": "fsde4fe203775a8f0fd14323",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	  "age": "30",
	  "sex": "male"
  }
}
```
### 老师添加课程
> * /teacher/addlesson

> * Input Parameters
>> * teacherID:requested
>> * description:requested
>> * teacherName:requested
>> * startDate:requested
>> * endDate:requested
>> * classTime:requested
>> * enrolldeadline:requested
>> * studentsLimit:requested
>> * classHours:requested
>> * telephone:requested
>> * price:requested

> * Successful Return
跳转老师添加过的所有课程界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到老师添加过的所有图书界面传送的数据为:
{
  "status": "success",
  "lessons": [{
    "_id": "58184fe203775a8f0fd1b096",
	  "teacherID": "fsde4fe203775a8f0fd14323",
    "description": "课程描述",
    "teacherName": "开课老师",
    "startDate": "课程开始时间",
    "endDate": "课程结束时间",
    "classTime": "上课时间",
	  "enrolldeadline": "报名截止日期",
	  "studentsLimit": "限制人数",
	  "classHours": "课程周期",
	  "telephone": "联系方式",
	  "price": "课程价格",
	  "enrollNum": "已报名人数",
	  "state": "课程状态"
  },......]
}
```
### 老师回复的所有问题
> * /teacher/replylist

> * Input Parameters

> * Successful Return
跳转老师所有回复过的问题界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误
>> * errcode = 3: 该老师没有回复

> * example
```
跳转老师所有回复过的问题界面传送的数据为:
{
  "status": "success",
  "replys": [
    {
  	  "parent": {
  		"_id": "58184fe203775a8f0fd1b096",
  		"avatar": "/images/avatars/avatar_sample.jpg"
    },question:{
  		"_id": "58184fe203775a8f0fd10326",
  		"content": "我家的孩子为什么会叛逆"
    },teacher:{
  		"_id": "fsde4fe203775a8f0fd14323",
  		"createAt": "2017-1-1 8:8:8"
    },"content": "你的孩子很健康"
  },......]
}
```
### 所有问题的列表
> * /teacher/questionlist

> * Input Parameters

> * Successful Return
跳转所有问题的列表界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部异常
>> * errcode = 3: 没有公开的提问

> * example
```
跳转所有问题的列表界面传送的数据为:
{
  "status": "success",
  "questions": [{
  	"parent": {
  		"_id": "58184fe203775a8f0fd1b096",
  		"avatar": "/images/avatars/avatar_sample.jpg"
  	},question:{
  		"_id": "58184fe203775a8f0fd10326",
  		"content": "我家的孩子为什么会叛逆"
  	}
  },......]
}
```
### 回复问题显示界面
> * /teacher/replyview

> * Input Parameters
>> * id:requested

> * Successful Return
跳转到回复问题显示界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到回复问题显示界面传送的数据为:
{
  "status": "success",
  "question": {
  	"parent": {
  		"_id": "58184fe203775a8f0fd1b096",
  		"avatar": "/images/avatars/avatar_sample.jpg"
  	},question:{
  		"_id": "58184fe203775a8f0fd10326",
  		"title": "标题",
  		"createAt", "2017-1-1 1:1:1"
  		"content": "我家的孩子为什么会叛逆"
  	}
  },
  "replys":[
    {
      "teacher":{
        "_id": "58184fe203775a8f0fd1b096",
        "avatar": "/images/avatars/avatar_sample.jpg",
        "username": "老师",
        "introduction": "这是个人简介",
        "name": "张三",
        "age": "30",
        "sex": "male"
      },
      "content":"你的孩子很健康"
    },......
  ]
}
```
### 提交回复问题
> * /teacher/replycommit

> * Input Parameters
>> * questionID:requested
>> * parentID:requested
>> * teacherID:requested
>> * content:requested

> * Successful Return
跳转到当前问题的详细回复信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到当前问题的详细回复信息界面传送的数据为:
{
  "status": "success",
  "question": {
  	"parent": {
  		"_id": "58184fe203775a8f0fd1b096",
  		"avatar": "/images/avatars/avatar_sample.jpg"
  	},question:{
  		"_id": "58184fe203775a8f0fd10326",
  		"title": "标题",
  		"createAt", "2017-1-1 1:1:1"
  		"content": "我家的孩子为什么会叛逆"
    }
  },
  "replys":[
    {
      "teacher":{
        "_id": "58184fe203775a8f0fd1b096",
        "avatar": "/images/avatars/avatar_sample.jpg",
        "username": "老师",
        "introduction": "这是个人简介",
        "name": "张三",
        "age": "30",
        "sex": "male"
      },
      "content":"你的孩子很健康"
    },......
  ]
}
```

### 孩子信息
> * /child/childinfo

> * Input Parameters
>> * _id:requested

> * Successful Return
跳转到孩子的详细信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到孩子的详细信息界面传送的数据为:
{
  "status": "success",
  "info": {
  	"age": "12",
  	"sex": "male",
  	"grade": "1",
  	"character": "开朗"
  },
  "parent":{
  	"age": "40",
  	"sex": "male",
  	"character": "开朗",
  	"relationship": "father"
  },
  "emotions":[
    {
    	"emotion":{
        "value": 88,
        "average": 60,
        "calm", 50,
        "happy", 50,
        "angry", 50,
        "sad", 50,
        "report", " 心情愉悦"
      }
    	"questions": [
      	{
      		"questionid": "58184ffdsds775a8f0fd1b096",
      		"title": "标题"
      	},......]

    },......
  ]
}
```

## 手机客户端接口说明
Requests use POST method, return JSON (all the key-value in string format).

All the error return json formated as:

```
{text, errcode, status}
if status == "success" means success
if status == "error" means error
```

##登录注册接口
### 用于获取手机短信验证码
> * /api/user/sendCode

> * Input Parameters
>> * telephone:requested

> * Successful Return
>> * {status,code}//success
>> * code status为success时，code为正确的验证码

> * Error Return
>> * {status,code,msg}//error
>> * status为error时，code为第三方短信平台返回的错误码，msg为第三方短信平台返回的错误信息
>> * errcode = 1: 手机号码为空

> * example

```
{
  "status": "success",
  "code": "929914"
}
```
```
{
  "status": "error",
  "code": 406,
  "msg": "手机格式不正确，格式为11位的数字."
}
```

### 用户注册
> * /api/user/signup

> * Input Parameters
>> * telephone:requested
>> * password:requested

> * Successful Return
>> * {status, user:{userID}}

> * Error Return
>> * errcode = 1: 手机号或密码为空
>> * errcode = 2: 数据库查询失败
>> * errcode = 3: 该手机号已注册
>> * errcode = 4: 保存用户失败

> * example

```
{"status":"success", "user":{"userID":"58184fe203775a8f0fd1b096"}}
```

### 用户使用手机账户登陆
> * /api/user/signin

> * Input Parameters
>> * telephone:requested
>> * password:requested

> * Successful Return
>> * {user:{userID,token},status}

> * Error Return
>> * errcode = 1: 手机号码或密码为空
>> * errcode = 2: 数据库查询错误
>> * errcode = 3: 该用户未注册
>> * errcode = 4: 密码匹配错误
>> * errcode = 5: 保存失败
>> * errcode = 6: 密码不正确

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
  }
}
```

### 注销登录
> * /api/user/logout

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID，token}}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库保存出错

> * example

```
{"status":"success","user":{"userID":"58184fe203775a8f0fd1b096","token":"e59cc2dfab213b4cd1d3b562bdc22e56ad26556034539e01742a5c81396af613abd2f7ce75577e724b15e46af0ce6894c4dff0f2ca4c24bf6bd636290d161499"}}
```

### 用户修改密码
> * /api/user/resetPassword

> * Input Parameters
>> * password:requested
>> * newpassword:requested
>> * re_newpassword:requested
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID}}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 有空值
>> * errcode = 4: 密码匹配错误
>> * errcode = 5: 原密码不正确
>> * errcode = 6: 两次输入的密码不匹配
>> * errcode = 7: 新密码保存错误

> * example

```
{"status":"success","user":{"userID":"1001"}}
```

##提问接口
### 获取相关提问列表(一期为获取全部提问)
> * /api/user/question/similar

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {status, similar:[{questionID,title,content},{},...]}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误


> * example

```
{
    "status": "success",
    "similar": [
        {
            "questionID": "598c37e349f5412215bdc42d",
            "title": "Test2",
            "content": "This is a test"
        },
        {
            "questionID": "598c379949f5412215bdc42c",
            "title": "Test1",
            "content": "This is a test"
        }
    ]
}
```

### 根据用户id获取提问列表
> * /api/user/question/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {status, similar:[{title,content,createAt},{},...]}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 该用户没有提问

> * example

```
{
    "status": "success",
    "questions": [
        {
            "title": "Test2",
            "content": "This is a test",
            "createAt": "2017-08-10T10:39:31.582Z"
        },
        {
            "title": "Test1",
            "content": "This is a test",
            "createAt": "2017-08-10T10:38:17.713Z"
        }
    ]
}
```

### 用户添加新提问
> * /api/user/question/new

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * parentID（用户id）
>> * title（提问标题）
>> * content（提问内容）
>> * openFlag（提问是否公开标志位）

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 提问保存出错

> * example

```
{"status": "success"}
```

### 根据提问id获取提问详情
> * /api/user/question/detail

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * questionID:requested

> * Successful Return
>> * {status,question:{title,content,createAt},replys:[{teacherID,content},{},...]}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 未查询到该问题
>> * errcode = 5: 数据库查询出错

> * example

```
{
    "status": "success",
    "question": {
        "title": "Test1",
        "content": "This is a test",
        "createAt": "2017-08-10T10:38:17.713Z"
    },
    "replys": [
        {
            "teacherID": "598d194a416bfc9331706117",
            "content": "This is a test2 reply"
        },
        {
            "teacherID": "598d194a416bfc9331706117",
            "content": "This is a test2 reply"
        }
    ]
}
```

##情绪接口
### 根据课程id查看课程详情
> * /api/user/lesson/detail

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested

> * Successful Return
>> * {status,emotion:{value,calm,happy,angry,sad,report}}
>> * value：情绪指数，calm：平静指数，happy:愉悦指数，angry:愤怒指数,sad:悲伤指数,report:情绪分析报告

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 未查询到情绪数据

> * example

```
{
    "status": "success",
    "emotion": {
        "value": 99,
        "calm": 60,
        "happy": 80,
        "angry": 30,
        "sad": 30,
        "report": "This is a test3 report"
    }
}
```

##课程接口
### 根据课程id查看课程详情
> * /api/user/emotion/latest

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,lesson:{teacherID,teacherName,description,teacherName,startDate,endDate,classTime,enrolldeadline,studentsLimit,classHours,telephone,price,enrollNum,state},enroll}
>> * description:课程描述,teacherName:开课老师,startDate:课程开始日期,endDate:课程结束日期,classTime:上课时间,enrolldeadline:报名截止日期,studentsLimit:限制人数,classHours:课程周期,telephone:联系方式,price:课程价格,enrollNum:已报名人数,state:课程状态： 1：未开始，2：正在进行中，3：课程已结束
>> * enroll:true 用户已经报名；false 用户未报名

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 该课程不存在
>> * errcode = 5: 订单查询错误

> * example

```
{
    "status": "success",
    "lesson": {
        "_id": "598d6f0d122dd3083df2eb15",
        "teacherID": "598d194a416bfc9331706117",
        "studentslimit": 77,
        "createAt": "2017-08-18T08:24:22.122Z",
        "state": "1",
        "enrollNum": 71,
        "price": 1,
        "telephone": "13051137962",
        "classHours": "7 classhours",
        "studentsLimit": 0,
        "enrolldeadline": "2017-08-08T00:00:00.000Z",
        "classTime": "4 pm everyday",
        "endDate": "2017-08-10T00:00:00.000Z",
        "startDate": "2017-08-07T00:00:00.000Z",
        "teacherName": "amsfe",
        "description": "this is a test lesson",
        "title": "test1"
    },
    "enroll": true
}
```

### 用户报名课程
> * /api/user/bill/add

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 订单保存错误
>> * errcode = 4: 课程更新数据错误

> * example

```
{
    "status": "success"
}
```

### 获取该用户报名的课程
> * /api/user/lesson/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {status,bills:[{title,lessonID,createAt},{},...]}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询出错
>> * errcode = 4: 该用户没有提问

> * example

```
{
    "status": "success",
    "bills": [
        {
            "title": "test1",
            "lessonID": "598d6f0d122dd3083df2eb15",
            "createAt": "2017-08-18T09:09:18.776Z"
        },
        {
            "title": "test1",
            "lessonID": "598d6f0d122dd3083df2eb15",
            "createAt": "2017-08-18T09:15:09.486Z"
        }
    ]
}
```

##书籍接口
### 根据id查看某一本书籍
> * /api/user/book/detail

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * bookID:requested

> * Successful Return
>> * {status,book:{_id,teacherID,purchaseLink,createAt,introduction,publishHouse,author,title}}
>> * _id:书籍ID,teacherID:发布该书籍的老师ID,purchaseLink该书籍的购买链接:,createAt:该书籍的创建时间,introduction:书籍简介,publishHouse:出版社,author:作者,title:书名

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询出错
>> * errcode = 4: 未有该书籍

> * example

```
{
    "status": "success",
    "book": {
        "_id": "598d8d1c122dd3083df2eb16",
        "teacherID": "598d194a416bfc9331706117",
        "purchaseLink": "http://www.runoob.com/mongodb/mongodb-update.html",
        "createAt": "2017-08-18T08:24:22.208Z",
        "introduction": "this is a test book",
        "publishHouse": "people education publishHouse",
        "author": "amsfe",
        "title": "test book"
    }
}
```

##老师接口
### 根据老师id查看此老师的详细信息
> * /api/user/teacher/detail

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * teacherID:requested

> * Successful Return
>> * {status,teacher:{name,avatar,sex,age,introduction}}
>> * name:老师名字,avatar:老师头像,sex:性别,age:年龄,introduction:个人简介

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 老师ID为空
>> * errcode = 4: 数据库查询错误
>> * errcode = 5: 未有该老师

> * example

```
{
    "status": "success",
    "teacher": {
        "name": "test",
        "avatar": "",
        "sex": "male",
        "age": 30,
        "introduction": "This is a test teacher create by amsfe"
    }
}
```

##用户信息接口
### 获取用户个人信息--对应app侧滑栏用户信息设置
> * /api/user/information/detail

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{avatar,nickname,relationship,childrenTelephone,birthday}}
>> * avatar:头像,nickname:孩子昵称,relationship:与孩子关系,childrenTelephone:设备手机号,birthday:孩子生日

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 用户为空
>> * errcode = 4: 数据库查询出错

> * example

```
{
    "status": "success",
    "user": {
        "avatar": "/images/avatars/83f495b0-81a9-11e7-8cb8-f707407f4137.jpg",
        "nickname": "懂你小宝",
        "relationship": "爸爸",
        "childrenTelephone": "1111111",
        "birthday": "2017-05-01T00:00:00.000Z"
    }
}
```

### 用户填写信息--对应app侧滑栏用户信息设置
> * /api/user/information/modify

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * nickname:requested
>> * relationship:requested
>> * childrenTelephone:requested
>> * birthday:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 有空值
>> * errcode = 4: 孩子信息保存出错
>> * errcode = 5: 用户信息保存出错

> * example

```
{
    "status": "success"
}
```

### 修改用户头像
> * /api/user/information/avatar

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID,avatar}}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 函数调用异常
>> * errcode = 4: 用户数据更新出错

> * example

```
{
    "status": "success",
    "user": {
        "userID": "598bbac2a6d5260f02b26ee0",
        "avatar": "/images/avatars/cd977500-83f9-11e7-b99e-33d4ea96a034.jpg"
    }
}
```

### 用户添加孩子以及自己的信息--第一次提问
> * /api/user/information/add

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * childAge:requested
>> * childSex:requested
>> * childGrade:requested
>> * childCharacter:requested
>> * parentAge:requested
>> * parentSex:requested
>> * parentCharacter:requested
>> * relationship:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 有空值
>> * errcode = 4: 查询用户出错
>> * errcode = 5: 未查询到该用户
>> * errcode = 6: 保存用户数据出错
>> * errcode = 7: 查询孩子出错
>> * errcode = 8: 未查询到该孩子
>> * errcode = 9: 保存孩子出错

> * example

```
{
    "status": "success"
}
```

##手表接口
### 获取手表信息--对应app设备绑定获取已经绑定的手表信息
> * /api/user/information/detail

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,watch:{IMEI,watchTelephone}}
>> * IMEI:手表IMEI号，watchTelephoe:设备手机号

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 该账号未绑定

> * example

```
{
    "stauts": "success",
    "watch": {
        "IMEI": "358511020048751",
        "watchTelephone": "18763800777"
    }
}
```

### 绑定手表和主控号码
> * /api/user/watch/bind

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * IMEI:requested
>> * watchTelephone:requested
>> * controlTelephone:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 有空值
>> * errcode = 4: 数据库查询错误
>> * errcode = 5: 数据库更新错误
>> * errcode = 6: 数据库保存出错
>> * errcode = 7: 给手表发送命令失败

> * example

```
{
    "stauts": "success"
}
```

### 为手表添加联系人
> * /api/user/watch/contact/add

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * contactName:requested
>> * telephoneNum:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 有空值
>> * errcode = 4: 该用户注册手机号未绑定手表
>> * errcode = 5: 数据库查询出错
>> * errcode = 6: 该手表该联系人已存在
>> * errcode = 7: 数据库保存出错
>> * errcode = 8: 给手表发命令出错

> * example

```
{
    "stauts": "success"
}
```

### 获取手表电话号码--对应app‘电话’功能
> * api/user/watch/call

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status，childrenTelephone}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 该用户不存在

> * example

```
{
    "status": "success",
    "childrenTelephone": "1111111"
}
```

### 立即定位
> * /api/user/watch/locate

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询出错
>> * errcode = 4: 该用户注册手机号未绑定手表
>> * errcode = 5: 给手表发命令出错

> * example

```
{
    "status": "success"
}
```