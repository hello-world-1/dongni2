## 接口
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
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
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
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
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
跳转到重新添加老师界面

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
{
  "status": "add_error",
  "teacher": {
    "avatar": "/images/avatars/avatar_sample.jpg",
    "introduction": "这是个人简介",
    "name": "张三",
	"age": "30",
	"sex": "male"
  }
}
```
### 注销登录
> * /user/logout

> * Input Parameters
>> * token:requested

> * Successful Return
跳转到登录界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success"}
```
### 老师修改头像
> * /teacher/changeavatar

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * file.name:requested
>> * file.path:requested

> * Successful Return
跳转到老师个人信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example
```
跳转到老师个人信息界面传送的数据为:
{
  "status": "success",
  "teacher": {
    "_id": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "username": "老师",
    "introduction": "这是个人简介",
    "name": "张三",
	"age": "30",
	"sex": "male"
  }
}
```
{"status":"success"}
### 修改老师个人信息
> * /teacher/changeinfo

> * Input Parameters
>> * _id:requested
>> * token:requested
>> * description:requested
>> * username:requested
>> * sex:requested
>> * introduction:requested
>> * name:requested
>> * age:requested

> * Successful Return
跳转到老师个人信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example
```
跳转到老师个人信息界面传送的数据为:
{
  "status": "success",
  "teacher": {
   "_id": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
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
>> * _id:requested
>> * token:requested

> * Successful Return
跳转到老师添加过的所有图书界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
### 图书的详细信息
> * /teacher/bookdetail

> * Input Parameters
>> * _id:requested

> * Successful Return
跳转到图书的详细信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
	"token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
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
>> * avatar:requested
>> * author:requested
>> * publishHouse:requested
>> * introduction:requested
>> * purchaseLink:requested

> * Successful Return
跳转老师添加过的所有图书界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
>> * _id:requested
>> * token:requested

> * Successful Return
跳转到老师添加过的所有课程界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
### 课程的详细信息
> * /teacher/lessondetail

> * Input Parameters
>> * _id:requested

> * Successful Return
跳转到课程的详细信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
	"token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
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
>> * errcode = 2: 函数调用异常

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
>> * _id:requested

> * Successful Return
跳转老师所有回复过的问题界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example
```
跳转老师所有回复过的问题界面传送的数据为:
{
  "status": "success",
  "replys": [{
	"parent": {
		"_id": "58184fe203775a8f0fd1b096",
		"avatar": "/images/avatars/avatar_sample.jpg"
  },question:{
		"_id": "58184fe203775a8f0fd10326",
		"content": "我家的孩子为什么会叛逆"
  },teacher:{
		"_id": "fsde4fe203775a8f0fd14323",
		"content": "你的孩子很健康",
		"createAt": "2017-1-1 8:8:8"
  }
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
>> * errcode = 2: 函数调用异常

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
>> * _id:requested

> * Successful Return
跳转到回复问题显示界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
  }
}
```
### 提交回复问题
> * /teacher/replycommit

> * Input Parameters
>> * _id:requested
>> * parentid:requested
>> * teacherid:requested
>> * content:requested

> * Successful Return
跳转到当前问题的详细回复信息界面

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

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
	},replys:[
		{
			"teacherid": "58184fe203775a8f0fd1b096",
			"name": "张三",
			"content": "你的孩子很健康",
			"createAt": "2017-1-1 1:1:1"
		},
	]
  }
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
>> * errcode = 2: 函数调用异常

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
  "emotions":[{
	"value": 88,
	"average": 60,
	"calm", 50,
	"happy", 50,
	"angry", 50,
	"sad", 50,
	"report", " 心情愉悦",
	"questions": [
	{
		"questionid": "58184ffdsds775a8f0fd1b096",
		"title": "标题",
		"replys": [{
			"teacherID": "58184fe203775a8f0fd1b096",
			"content": "你的孩子很健康"
			},...
		]
	},]

  },{

  }]

```