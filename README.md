## 推送接口 使用推送服务之前必须先使用/api/user/addPushID路由注册pushID
### 用户强制下线推送
> * 推送数据格式为"forceoffline token"
> *客户端判断此推送是否包含forceoffline,如果包含则以空格分割,判断安卓端本地存储的token与传入的token是否一致,如果一致则强制下线

## 后台接口
### 用户使用账号登录
> * /user/login

> * Input Parameters
>> * username:requested
>> * password:requested

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 2: 账号不存在
>> * errcode = 3: 密码不正确

> * example
```
管理员登录返回的数据为:
{
  "status": "success",
  "teachers": [
    {
      "_id": "59955d2bbc44c410ea320be2",
      "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
      "username": "teacher5",
      "__v": 0,
      "meta": {
        "updateAt": "2017-08-17T09:08:59.296Z",
        "createAt": "2017-08-17T09:08:59.296Z"
      },
      "age": 30,
      "introduction": "nihao",
      "sex": "male",
      "name": "lisi",
      "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
    },......
  ]
}
老师登录返回的数据为:
{
  "status": "success",
  "teacher": {
    "_id": "59955d2bbc44c410ea320be2",
    "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
    "username": "teacher5",
    "__v": 0,
    "meta": {
      "updateAt": "2017-08-17T09:08:59.296Z",
      "createAt": "2017-08-17T09:08:59.296Z"
    },
    "age": 30,
    "introduction": "nihao",
    "sex": "male",
    "name": "lisi",
    "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
  }
}
```
### 管理员添加老师
> * /admin/addteacher

> * Input Parameters
>> * username:requested
>> * password:requested
>> * file:requested  --file为文件类型
>> * introduction:requested
>> * name:requested
>> * age:requested
>> * sex:requested

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 2: 用户名已存在
>> * errcode = 5: 用户未登录
>> * errcode = 6: 操作未授权

> * example

```
返回的数据格式:按老师的最后更新内容时间排序
{
  "status": "success",
  "teachers": [
    {
      "_id": "59955d2bbc44c410ea320be2",
      "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
      "username": "teacher5",
      "__v": 0,
      "meta": {
        "updateAt": "2017-08-17T09:08:59.296Z",
        "createAt": "2017-08-17T09:08:59.296Z"
      },
      "age": 30,
      "introduction": "nihao",
      "sex": "male",
      "name": "lisi",
      "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
    },......
  ]
}
```
### 注销登录
> * /user/logout

> * Input Parameters

> * Error Return
>> * errcode = 5: 用户未登录

> * example
```
{"status":"success"}
```
### 老师修改头像:只有登录的老师自己可以修改
> * /teacher/changeavatar

> * Input Parameters
>> * file:requested  --file为文件类型

> * Successful Return
跳转到老师个人信息界面

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
{
  "status": "success",
  "teacher": {
    "_id": "59955d2bbc44c410ea320be2",
    "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
    "username": "teacher5",
    "__v": 0,
    "meta": {
      "updateAt": "2017-08-17T09:08:59.296Z",
      "createAt": "2017-08-17T09:08:59.296Z"
    },
    "age": 30,
    "introduction": "nihao",
    "sex": "male",
    "name": "lisi",
    "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
  }
}
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
>> * file:requested  --file为文件类型

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
{
  "status": "success",
  "teacher": {
    "_id": "59955d2bbc44c410ea320be2",
    "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
    "username": "teacher5",
    "__v": 0,
    "meta": {
      "updateAt": "2017-08-17T09:08:59.296Z",
      "createAt": "2017-08-17T09:08:59.296Z"
    },
    "age": 30,
    "introduction": "nihao",
    "sex": "male",
    "name": "lisi",
    "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
  }
}
```
### 当前老师添加过的所有图书
> * /teacher/booklist

> * Input Parameters
>> * 无

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 2: 系统内部错误
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:按书籍的添加时间逆序排序
{
  "status": "success",
  "books": [
    {
      "_id": "59955ee99e1f16117b2e43c3",
      "purchaseLink": "purchaseLink",
      "teacherID": "59955d2bbc44c410ea320be2",
      "__v": 0,
      "createAt": "2017-08-17T09:16:25.187Z",
      "introduction": "introduction",
      "publishHouse": "publishHouse",
      "author": "author",
      "title": "title",
	  "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
    },......
  ]
}
```
### 图书的详细信息
> * /teacher/bookdetail

> * Input Parameters
>> * bookid:requested

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 2: bookid为空
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
{
  "status": "success",
  "book": {
    "_id": "59955f206aa71911a542f909",
    "purchaseLink": "purchaseLink",
    "teacherID": "59955d2bbc44c410ea320be2",
    "__v": 0,
    "createAt": "2017-08-17T09:17:20.538Z",
    "introduction": "introduction",
    "publishHouse": "publishHouse",
    "author": "author",
    "title": "title",
	"avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
  },
  "teacher": {
    "_id": "59955d2bbc44c410ea320be2",
    "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
    "username": "teacher5",
    "__v": 0,
    "meta": {
      "updateAt": "2017-08-17T09:08:59.296Z",
      "createAt": "2017-08-17T09:08:59.296Z"
    },
    "age": 30,
    "introduction": "nihao",
    "sex": "male",
    "name": "lisi",
    "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
  }
}
```
### 老师添加图书
> * /teacher/addbook

> * Input Parameters
>> * title:requested
>> * author:requested
>> * publishHouse:requested
>> * introduction:requested
>> * purchaseLink:requested
>> * file:requested  --file为文件类型

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
{
  "status": "success",
  "books": [
    {
      "_id": "59955ee99e1f16117b2e43c3",
      "purchaseLink": "purchaseLink",
      "teacherID": "59955d2bbc44c410ea320be2",
      "__v": 0,
      "createAt": "2017-08-17T09:16:25.187Z",
      "introduction": "introduction",
      "publishHouse": "publishHouse",
      "author": "author",
      "title": "title",
	  "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
    },......
  ]
}
```
### 当前老师添加过的所有课程
> * /teacher/lessonlist

> * Input Parameters
> >> * 无

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
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
    "state": "课程状态",
	"avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
  },......]
}
```
### 课程的详细信息
> * /teacher/lessondetail

> * Input Parameters
>> * lessonid:requested

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
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
	  "state": "课程状态",
	  "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
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
>> * description:requested
>> * teacherName:requested
>> * startDate:requested
>> * endDate:requested
>> * classTime:requested
>> * enrolldeadline:requested  --日期参数的格式为2017-01-19 13:00:00
>> * studentsLimit:requested
>> * classHours:requested
>> * telephone:requested
>> * price:requested
>> * file:requested  --file为文件类型

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 5: 用户未登录

> * example
```
返回的数据格式:
{
  "status": "success",
  "lessons": [{
    "_id": "58184fe203775a8f0fd1b096",
	  "teacherID": "fsde4fe203775a8f0fd14323",
      "description": "课程描述",
      "teacherName": "开课老师",
      "startDate": "课程开始时间", --日期参数的格式为2017-01-19 13:00:00
      "endDate": "课程结束时间",
      "classTime": "上课时间",
	  "enrolldeadline": "报名截止日期",
	  "studentsLimit": "限制人数",
	  "classHours": "课程周期",
	  "telephone": "联系方式",
	  "price": "课程价格",
	  "enrollNum": "已报名人数",
	  "state": "课程状态",
	  "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
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
        "_id": "59965ba9e1097e36ab8fdb47",
        "telephone": "15387561723",
        "childID": "599c8996712784694ddef8fe",
        "meta": {
          "updateAT": "2017-08-22T20:37:39.050Z",
          "createAt": "2017-08-22T20:37:39.050Z"
        },
        "childrenTelephone": "",
        "relationship": "father",
        "avatar": "",
        "character": "ufdahappy",
        "sex": "male",
        "age": "23"
      },
      "question": {
        "_id": "599666e3e1097e36ab8fdb4b",
        "parentID": "59965ba9e1097e36ab8fdb47",
        "conten": "content",
        "createAt": "2017-08-22T20:37:46.682Z",
        "replyFlag": "0",
        "openFlag": "1",
        "content": "",
        "title": "question"
      },
      "teacher": {
        "_id": "59955d2bbc44c410ea320be2",
        "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
        "username": "teacher5",
        "__v": 0,
        "meta": {
          "updateAt": "2017-08-17T09:08:59.296Z",
          "createAt": "2017-08-17T09:08:59.296Z"
        },
        "age": 30,
        "introduction": "nihao",
        "sex": "male",
        "name": "lisi",
        "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
      },
      "content": "health"
    }
  ]
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
  "questions": [
    {
      "question": {
        "_id": "599666e3e1097e36ab8fdb4b",
        "parentID": "59965ba9e1097e36ab8fdb47",
        "conten": "content",
        "createAt": "2017-08-22T20:41:27.903Z",
        "replyFlag": "0",
        "openFlag": "1",
        "content": "",
        "title": "question"
      },
      "parent": {
        "_id": "59965ba9e1097e36ab8fdb47",
        "telephone": "15387561723",
        "childID": "599c8996712784694ddef8fe",
        "meta": {
          "updateAT": "2017-08-22T20:41:23.274Z",
          "createAt": "2017-08-22T20:41:23.274Z"
        },
        "childrenTelephone": "",
        "relationship": "father",
        "avatar": "",
        "character": "ufdahappy",
        "sex": "male",
        "age": "23"
      }
    },
    {
      "question": {
        "_id": "599c6c58712784694ddef8fb",
        "parentID": "59965ba9e1097e36ab8fdb47",
        "conten": "content2",
        "createAt": "2017-08-22T20:41:27.905Z",
        "replyFlag": "0",
        "openFlag": "1",
        "content": "",
        "title": "question2"
      },
      "parent": {
        "_id": "59965ba9e1097e36ab8fdb47",
        "telephone": "15387561723",
        "childID": "599c8996712784694ddef8fe",
        "meta": {
          "updateAT": "2017-08-22T20:41:23.274Z",
          "createAt": "2017-08-22T20:41:23.274Z"
        },
        "childrenTelephone": "",
        "relationship": "father",
        "avatar": "",
        "character": "ufdahappy",
        "sex": "male",
        "age": "23"
      }
    }
  ]
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
      "_id": "59965ba9e1097e36ab8fdb47",
      "telephone": "15387561723",
      "childID": "599c8996712784694ddef8fe",
      "meta": {
        "updateAT": "2017-08-22T20:44:20.819Z",
        "createAt": "2017-08-22T20:44:20.819Z"
      },
      "childrenTelephone": "",
      "relationship": "father",
      "avatar": "",
      "character": "ufdahappy",
      "sex": "male",
      "age": "23"
    },
    "question": {
      "_id": "599666e3e1097e36ab8fdb4b",
      "parentID": "59965ba9e1097e36ab8fdb47",
      "conten": "content",
      "createAt": "2017-08-22T20:44:24.821Z",
      "replyFlag": "0",
      "openFlag": "1",
      "content": "",
      "title": "question"
    }
  },
  "replys": [
    {
      "teacher": {
        "_id": "59955d2bbc44c410ea320be2",
        "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
        "username": "teacher5",
        "__v": 0,
        "meta": {
          "updateAt": "2017-08-17T09:08:59.296Z",
          "createAt": "2017-08-17T09:08:59.296Z"
        },
        "age": 30,
        "introduction": "nihao",
        "sex": "male",
        "name": "lisi",
        "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
      },
      "content": "health"
    }
  ]
}
```
### 所有问题及回答
> * /teacher/allquestionreply

> * Input Parameters

> * Successful Return

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到所有问题及回答显示界面传送的数据为:
{
  "all": [
    {
      "question": {
        "parent": {
          "_id": "59965ba9e1097e36ab8fdb47",
          "telephone": "15387561723",
          "childID": "599c8996712784694ddef8fe",
          "meta": {
            "updateAT": "2017-08-22T20:54:40.614Z",
            "createAt": "2017-08-22T20:54:40.614Z"
          },
          "childrenTelephone": "",
          "relationship": "father",
          "avatar": "",
          "character": "ufdahappy",
          "sex": "male",
          "age": "23"
        },
        "question": {
          "_id": "599666e3e1097e36ab8fdb4b",
          "parentID": "59965ba9e1097e36ab8fdb47",
          "conten": "content",
          "createAt": "2017-08-22T20:55:44.460Z",
          "replyFlag": "0",
          "openFlag": "1",
          "content": "",
          "title": "question"
        }
      },
      "replys": [
        {
          "teacher": {
            "_id": "59955d2bbc44c410ea320be2",
            "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
            "username": "teacher5",
            "__v": 0,
            "meta": {
              "updateAt": "2017-08-17T09:08:59.296Z",
              "createAt": "2017-08-17T09:08:59.296Z"
            },
            "age": 30,
            "introduction": "nihao",
            "sex": "male",
            "name": "lisi",
            "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
          },
          "content": "health"
        }
      ]
    },
    {
      "question": {
        "parent": {
          "_id": "59965ba9e1097e36ab8fdb47",
          "telephone": "15387561723",
          "childID": "599c8996712784694ddef8fe",
          "meta": {
            "updateAT": "2017-08-22T20:54:40.614Z",
            "createAt": "2017-08-22T20:54:40.614Z"
          },
          "childrenTelephone": "",
          "relationship": "father",
          "avatar": "",
          "character": "ufdahappy",
          "sex": "male",
          "age": "23"
        },
        "question": {
          "_id": "599c6c58712784694ddef8fb",
          "parentID": "59965ba9e1097e36ab8fdb47",
          "conten": "content2",
          "createAt": "2017-08-22T20:55:44.466Z",
          "replyFlag": "0",
          "openFlag": "1",
          "content": "",
          "title": "question2"
        }
      }
    }
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
      "_id": "59965ba9e1097e36ab8fdb47",
      "telephone": "15387561723",
      "childID": "599c8996712784694ddef8fe",
      "meta": {
        "updateAT": "2017-08-22T21:01:18.391Z",
        "createAt": "2017-08-22T21:01:18.391Z"
      },
      "childrenTelephone": "",
      "relationship": "father",
      "avatar": "",
      "character": "ufdahappy",
      "sex": "male",
      "age": "23"
    },
    "question": {
      "_id": "599666e3e1097e36ab8fdb4b",
      "parentID": "59965ba9e1097e36ab8fdb47",
      "conten": "content",
      "createAt": "2017-08-22T21:01:24.690Z",
      "replyFlag": "0",
      "openFlag": "1",
      "content": "",
      "title": "question"
    }
  },
  "replys": [
    {
      "teacher": {
        "_id": "59955d2bbc44c410ea320be2",
        "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
        "username": "teacher5",
        "__v": 0,
        "meta": {
          "updateAt": "2017-08-17T09:08:59.296Z",
          "createAt": "2017-08-17T09:08:59.296Z"
        },
        "age": 30,
        "introduction": "nihao",
        "sex": "male",
        "name": "lisi",
        "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
      },
      "content": "health"
    },
    {
      "teacher": {
        "_id": "59955d2bbc44c410ea320be2",
        "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
        "username": "teacher5",
        "__v": 0,
        "meta": {
          "updateAt": "2017-08-17T09:08:59.296Z",
          "createAt": "2017-08-17T09:08:59.296Z"
        },
        "age": 30,
        "introduction": "nihao",
        "sex": "male",
        "name": "lisi",
        "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
      },
      "content": "health"
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
  "
  "child": {
    "_id": "599c8996712784694ddef8fe",
    "nickname": "hello",
    "pparent": {
    "_id": "59965ba9e1097e36ab8fdb47",
    "telephone": "15387561723",
    "childID": "599c8996712784694ddef8fe",
    "meta": {
      "updateAT": "2017-08-22T21:01:18.391Z",
      "createAt": "2017-08-22T21:01:18.391Z"
    },
    "childrenTelephone": "",
    "relationship": "father",
    "avatar": "",
    "character": "ufdahappy",
    "sex": "male",
    "age": "23"
  },parentID": "59965ba9e1097e36ab8fdb47",
    "meta": {
      "updateAT": "2017-08-22T21:01:18.391Z",
      "createAt": "2017-08-22T21:01:18.391Z"
    },
    "birthday": "2017-08-22T20:14:21.159Z",
    "sex": "male",
    "age": 12,
    "character": "ufdahappy",
    "grade": "2"
  },
  "emotion": {
    "_id": "599c909d712784694ddef902",
    "parentID": "59965ba9e1097e36ab8fdb47",
    "createAt": "2017-08-22T20:14:21.159Z",
    "time": "2017-08-22T21:07:22.442Z",
    "report": "",
    "sad": 0,
    "angry": 0,
    "happy": 0,
    "calm": 0,
    "value": 60
  },
  "averageEmotion": 60,
  "survey": [
      {
        "surveyName": "surveyName",
        "score":"1",
        "answer": [
          {
            "topicName": "topicName",
            "answer": "answer1",
            "answerIndex": 1,
            "_id": "599dfce41c017634ea7c1cf1"
          },
          {
            "topicName": "topicName2",
            "answer": "answer1",
            "answerIndex": 0,
            "_id": "599dfce41c017634ea7c1cf0"
          }
        ]
      }
  ],
  "questions": [
    {
      "question": {
        "parent": {
          "_id": "59965ba9e1097e36ab8fdb47",
          "telephone": "15387561723",
          "childID": "599c8996712784694ddef8fe",
          "meta": {
            "updateAT": "2017-08-22T21:01:18.391Z",
            "createAt": "2017-08-22T21:01:18.391Z"
          },
          "childrenTelephone": "",
          "relationship": "father",
          "avatar": "",
          "character": "ufdahappy",
          "sex": "male",
          "age": "23"
        },
        "question": {
          "_id": "599666e3e1097e36ab8fdb4b",
          "parentID": "59965ba9e1097e36ab8fdb47",
          "conten": "content",
          "createAt": "2017-08-22T21:07:22.446Z",
          "replyFlag": "0",
          "openFlag": "1",
          "content": "",
          "title": "question"
        }
      },
      "replys": [
        {
          "teacher": {
            "_id": "59955d2bbc44c410ea320be2",
            "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
            "username": "teacher5",
            "__v": 0,
            "meta": {
              "updateAt": "2017-08-17T09:08:59.296Z",
              "createAt": "2017-08-17T09:08:59.296Z"
            },
            "age": 30,
            "introduction": "nihao",
            "sex": "male",
            "name": "lisi",
            "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
          },
          "content": "health"
        },
        {
          "teacher": {
            "_id": "59955d2bbc44c410ea320be2",
            "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
            "username": "teacher5",
            "__v": 0,
            "meta": {
              "updateAt": "2017-08-17T09:08:59.296Z",
              "createAt": "2017-08-17T09:08:59.296Z"
            },
            "age": 30,
            "introduction": "nihao",
            "sex": "male",
            "name": "lisi",
            "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
          },
          "content": "health"
        }
      ]
    },
    {
      "question": {
        "parent": {
          "_id": "59965ba9e1097e36ab8fdb47",
          "telephone": "15387561723",
          "childID": "599c8996712784694ddef8fe",
          "meta": {
            "updateAT": "2017-08-22T21:01:18.391Z",
            "createAt": "2017-08-22T21:01:18.391Z"
          },
          "childrenTelephone": "",
          "relationship": "father",
          "avatar": "",
          "character": "ufdahappy",
          "sex": "male",
          "age": "23"
        },
        "question": {
          "_id": "599c6c58712784694ddef8fb",
          "parentID": "59965ba9e1097e36ab8fdb47",
          "conten": "content2",
          "createAt": "2017-08-22T21:07:22.446Z",
          "replyFlag": "0",
          "openFlag": "1",
          "content": "",
          "title": "question2"
        }
      }
    }
  ]
}
```
### 家长和孩子的信息
> * /teacher/parentChildInfo

> * Input Parameters
>> * relationID:requested

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 服务器内部错误

> * example
```
跳转到孩子的详细信息界面传送的数据为:
{
  "status": "success",
  "
  "child": {
    "_id": "599c8996712784694ddef8fe",
    "nickname": "hello",
    "pparent": {
    "_id": "59965ba9e1097e36ab8fdb47",
    "telephone": "15387561723",
    "childID": "599c8996712784694ddef8fe",
    "meta": {
      "updateAT": "2017-08-22T21:01:18.391Z",
      "createAt": "2017-08-22T21:01:18.391Z"
    },
    "childrenTelephone": "",
    "relationship": "father",
    "avatar": "",
    "character": "ufdahappy",
    "sex": "male",
    "age": "23"
  },parentID": "59965ba9e1097e36ab8fdb47",
    "meta": {
      "updateAT": "2017-08-22T21:01:18.391Z",
      "createAt": "2017-08-22T21:01:18.391Z"
    },
    "birthday": "2017-08-22T20:14:21.159Z",
    "sex": "male",
    "age": 12,
    "character": "ufdahappy",
    "grade": "2"
  },
  "emotion": {
    "_id": "599c909d712784694ddef902",
    "parentID": "59965ba9e1097e36ab8fdb47",
    "createAt": "2017-08-22T20:14:21.159Z",
    "time": "2017-08-22T21:07:22.442Z",
    "report": "",
    "sad": 0,
    "angry": 0,
    "happy": 0,
    "calm": 0,
    "value": 60
  },
  "averageEmotion": 60,
  "survey": [
      {
        "surveyName": "surveyName",
        "score":"1",
        "answer": [
          {
            "topicName": "topicName",
            "answer": "answer1",
            "answerIndex": 1,
            "_id": "599dfce41c017634ea7c1cf1"
          },
          {
            "topicName": "topicName2",
            "answer": "answer1",
            "answerIndex": 0,
            "_id": "599dfce41c017634ea7c1cf0"
          }
        ]
      }
  ],
  "questions": [
    {
      "question": {
        "parent": {
          "_id": "59965ba9e1097e36ab8fdb47",
          "telephone": "15387561723",
          "childID": "599c8996712784694ddef8fe",
          "meta": {
            "updateAT": "2017-08-22T21:01:18.391Z",
            "createAt": "2017-08-22T21:01:18.391Z"
          },
          "childrenTelephone": "",
          "relationship": "father",
          "avatar": "",
          "character": "ufdahappy",
          "sex": "male",
          "age": "23"
        },
        "question": {
          "_id": "599666e3e1097e36ab8fdb4b",
          "parentID": "59965ba9e1097e36ab8fdb47",
          "conten": "content",
          "createAt": "2017-08-22T21:07:22.446Z",
          "replyFlag": "0",
          "openFlag": "1",
          "content": "",
          "title": "question"
        }
      },
      "replys": [
        {
          "teacher": {
            "_id": "59955d2bbc44c410ea320be2",
            "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
            "username": "teacher5",
            "__v": 0,
            "meta": {
              "updateAt": "2017-08-17T09:08:59.296Z",
              "createAt": "2017-08-17T09:08:59.296Z"
            },
            "age": 30,
            "introduction": "nihao",
            "sex": "male",
            "name": "lisi",
            "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
          },
          "content": "health"
        },
        {
          "teacher": {
            "_id": "59955d2bbc44c410ea320be2",
            "password": "$2a$10$OacVap5CB6mugFnYzVSkUu97eqLAk0JpzGqqNFpmi9n5UP8jgh7XW",
            "username": "teacher5",
            "__v": 0,
            "meta": {
              "updateAt": "2017-08-17T09:08:59.296Z",
              "createAt": "2017-08-17T09:08:59.296Z"
            },
            "age": 30,
            "introduction": "nihao",
            "sex": "male",
            "name": "lisi",
            "avatar": "/images/avatars/d65fbb80-832b-11e7-995f-3173094ec89b.jpg"
          },
          "content": "health"
        }
      ]
    },
    {
      "question": {
        "parent": {
          "_id": "59965ba9e1097e36ab8fdb47",
          "telephone": "15387561723",
          "childID": "599c8996712784694ddef8fe",
          "meta": {
            "updateAT": "2017-08-22T21:01:18.391Z",
            "createAt": "2017-08-22T21:01:18.391Z"
          },
          "childrenTelephone": "",
          "relationship": "father",
          "avatar": "",
          "character": "ufdahappy",
          "sex": "male",
          "age": "23"
        },
        "question": {
          "_id": "599c6c58712784694ddef8fb",
          "parentID": "59965ba9e1097e36ab8fdb47",
          "conten": "content2",
          "createAt": "2017-08-22T21:07:22.446Z",
          "replyFlag": "0",
          "openFlag": "1",
          "content": "",
          "title": "question2"
        }
      }
    }
  ]
}
```
### 插入问卷
> * /survey/insertQuestion

> * Input Parameters
```
{ surveyName: 'surveyName',
  topic:
   [ { topicName: 'topicName',
       answer1: 'topic1answer1',
       answer2: 'topic1answer2',
       answer3: 'topic1answer3',
       answer4: 'topic1answer4' },
     { topicName: 'topicName2',
       answer1: 'topic2answer1',
       answer2: 'topic2answer2',
       answer3: 'topic2answer3',
       answer4: 'topic2answer4' } ] }
```
> * Successful Return
{status,"success"}

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 2: 题库名已存在
>> * errcode = 5: 用户未登录
>> * errcode = 6: 操作未授权

> * example
```
{
  "status": "success"
}
```
### 根据某个题库名生成考题
> * /survey/productSurvey

> * Input Parameters
>> * surveyName:requested

> * Error Return
>> * errcode = 1: 数据库出错
>> * errcode = 2: 题库名不存在

> * example
```
{
  "status": "success",
  "survey": [
    {
      "_id": "599cca01fd107b43cad62217",
      "surveyName": "surveyName",
      "__v": 0,
      "createAt": "2017-08-23T00:19:13.436Z",
      "topic": [
        {
          "topicName": "topicName",
          "answer1": "topic1answer1",
          "answer2": "topic1answer2",
          "answer3": "topic1answer3",
          "answer4": "topic1answer4",
          "_id": "599cca01fd107b43cad62219"
        },
        {
          "topicName": "topicName2",
          "answer1": "topic2answer1",
          "answer2": "topic2answer2",
          "answer3": "topic2answer3",
          "answer4": "topic2answer4",
          "_id": "599cca01fd107b43cad62218"
        }
      ]
    }
  ]
}
```
### 插入答案
> * /survey/insertAnswer

> * Input Parameters
```
{
    "surveyID":"599cca01fd107b43cad62217",
    "relationID":"59965ba9e1097e36ab8fdb47",
    "answer":[{
        "topicName":"topicName",
        "answer":"answer1",
        "answerIndex":"0"
    },
    {
        "topicName":"topicName2",
        "answer":"answer1",
        "answerIndex":"0"
    }]
}
```

> * Error Return
>> * errcode = 1: 数据库保存出错

> * example
```
{
  "status": "success"
}
```
### 家长所填写的全部问卷的历史记录
> * /survey/historyScore

> * Input Parameters
>> * relationID:requested

> * Successful Return
{status,"success","parent":{},surveyAnswer:[]}

> * Error Return
>> * errcode = 1: 查询数据库错误

> * example
```
{
  "status": "success",
  "parent": {
    "_id": "59965ba9e1097e36ab8fdb47",
    "telephone": "15387561723",
    "childID": "599c8996712784694ddef8fe",
    "meta": {
      "updateAT": "2017-08-23T21:26:14.276Z",
      "createAt": "2017-08-23T21:26:14.276Z"
    },
    "childrenTelephone": "",
    "relationship": "father",
    "avatar": "",
    "character": "ufdahappy",
    "sex": "male",
    "age": "23"
  },
  "surveyAnswer": [
    {
      "surveyName": "surveyName",
      "answer": [
        {
          "topicName": "topicName",
          "answer": "answer1",
          "answerIndex": 0,
          "_id": "599ccedd5b4666471d19e4f5"
        },
        {
          "topicName": "topicName2",
          "answer": "answer1",
          "answerIndex": 0,
          "_id": "599ccedd5b4666471d19e4f4"
        }
      ]
    },......
  ]
}
```
### 家长所填写的全部问卷的最新答案
> * /survey/newestScore

> * Input Parameters
>> * parentID:requested

> * Successful Return
{status,"success","parent":{},surveyAnswer:[]}

> * Error Return
>> * errcode = 1: 查询数据库错误

> * example
```
{
  "status": "success",
  "parent": {
    "_id": "59965ba9e1097e36ab8fdb47",
    "telephone": "15387561723",
    "childID": "599c8996712784694ddef8fe",
    "meta": {
      "updateAT": "2017-08-23T21:26:14.276Z",
      "createAt": "2017-08-23T21:26:14.276Z"
    },
    "childrenTelephone": "",
    "relationship": "father",
    "avatar": "",
    "character": "ufdahappy",
    "sex": "male",
    "age": "23"
  },
  "surveyAnswer": [
    {
      "surveyName": "surveyName",
      "answer": [
        {
          "topicName": "topicName",
          "answer": "answer1",
          "answerIndex": 0,
          "_id": "599ccedd5b4666471d19e4f5"
        },
        {
          "topicName": "topicName2",
          "answer": "answer1",
          "answerIndex": 0,
          "_id": "599ccedd5b4666471d19e4f4"
        }
      ]
    },......
  ]
}
```
### 全部问卷
> * /survey/allSurvey

> * Input Parameters

> * Successful Return
{status,"success","surveys":[]}

> * Error Return
>> * errcode = 1: 查询数据库错误
>> * errcode = 2: 题库名已存在

> * example
```
{
  "status": "success",
  "surveys": [
    {
      "_id": "599cca01fd107b43cad62217",
      "surveyName": "surveyName",
      "__v": 0,
      "createAt": "2017-08-23T00:19:13.436Z",
      "topic": [
        {
          "topicName": "topicName",
          "answer1": "topic1answer1",
          "answer2": "topic1answer2",
          "answer3": "topic1answer3",
          "answer4": "topic1answer4",
          "_id": "599cca01fd107b43cad62219"
        },
        {
          "topicName": "topicName2",
          "answer1": "topic2answer1",
          "answer2": "topic2answer2",
          "answer3": "topic2answer3",
          "answer4": "topic2answer4",
          "_id": "599cca01fd107b43cad62218"
        }
      ]
    }
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

## 登录注册接口
### 获取手机短信验证码
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
>> * {status}

> * Error Return
>> * errcode = 1: 手机号或密码为空
>> * errcode = 2: 数据库查询失败
>> * errcode = 3: 该手机号已注册
>> * errcode = 4: 保存用户失败

> * example

```
{"status":"success"}
```

### 用户使用手机账户登陆
> * /api/user/signin

> * Input Parameters
>> * telephone:requested
>> * password:requested

> * Error Return
>> * errcode = 1: 手机号码或密码为空
>> * errcode = 2: 数据库查询错误
>> * errcode = 3: 该用户未注册
>> * errcode = 4: 密码匹配错误
>> * errcode = 5: 保存失败
>> * errcode = 6: 密码不正确

> * example
>> * 如果绑定过设备isBind返回true否则返回false
```
{
  "status": "success",
  "userID": "599f6efca30d594d4df0fad3",
  "token": "bfd42c9e9d1f9650e189f15971a83b811ed8654a6438dcf28faf3ce6a5c3159aefdbeb766302fe49b0dc577bd64fae1ec6c6a8cfb82d32fb6ad957906e1794d5",
  "isBind": false
}
```

### 注销登录
> * /api/user/logout

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库保存出错

> * example

```
{"status":"success"}
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
>> * {status}

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
{"status":"success"}
```
### 切换设备
> * /api/user/switchDevice

> * Input Parameters
>> * userID:requested  --切换后的userID
>> * token:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 5: 更新数据库出错
> * example

```
{"status":"success"}
```
### 设置个人与孩子的信息
> * /api/user/information/changeInfo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * parentAge:requested
>> * parentSex:requested
>> * relation:requested
>> * parentTelephone:requested
>> * username:requested
>> * profession:requested
>> * childAge:requested
>> * token:requested
>> * childNickname:requested
>> * childSexStr:requested
>> * childGrade:requested
>> * childBirth:requested
>> * childCharacter:requested
>> * chilPhone:requested

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 5: 更新数据库出错

> * example
```
返回的数据格式:
{
  "status": "success"
}
```
### 首页展示的数据,只有安卓端判断用户绑定设备以后才发送此请求
> * /api/user/indexPage

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 用户未添加过设备
>> * errcode = 4: 密码匹配错误
>> * errcode = 5: 原密码不正确
>> * errcode = 6: 两次输入的密码不匹配
>> * errcode = 7: 新密码保存错误

> * example

```
{"status": "success",
 "userID": "dsaffffffffffdsfsafdfdfaf",
 "nickname": "son",
 "device":[
	{
		"parentID": "fsafhjksdhfkhasdfjkhdjksah",
        IMEI: "12897381273817297",
        nickname: "son",
        relation: "parent"
    },.....

 ],
 "emotion": {
        "value": 99,
        "calm": 60,
        "happy": 80,
        "angry": 30,
        "sad": 30,
        "report": "This is a test3 report"
 },
 "averageEmotion":50,
 "childPhone":"15111115525"
}
```
### 添加联系人
> * /api/user/addContact

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * contactName:requested
>> * contactPhone:requested

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 已添加过该手机号
>> * errcode = 5: 数据库保存错误

> * example

```
{
    "status": "success"
}
```
### 修改联系人
> * /api/user/changeContact

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * contactName:requested
>> * contactPhone:requested
>> * oldContactName:requested
>> * oldContactPhone:requested

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 未添加过该手机号
>> * errcode = 5: 数据库保存错误

> * example

```
{
    "status": "success"
}
```
### 查询联系人
> * /api/user/findContact

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 数据库查询错误
>> * errcode = 4: 没有添加过联系人
>> * errcode = 5: 数据库保存错误

> * example

```
{
    "status": "success",
	"contacts":[{
		"contactName":"father",
		"contactPhone":"15376767623"
	},{
		"contactName":"father",
		"contactPhone":"15376767623"
	},.....]
}
```
## 提问接口
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

## 情绪接口
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

## 课程接口
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
### 添加pushID
> * /api/user/addPushID

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pushID:requested

> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 0: userID或token为空
>> * errcode = 1: 数据库查询失败
>> * errcode = 2: 该用户不存在
>> * errcode = 3: 保存错误

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

## 书籍接口
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

## 老师接口
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

## 用户信息接口
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

## 手表接口
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
>> * nickname:requested

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
>> * errcode = 8: 设备已被绑定过

> * example

```
{
    "stauts": "success"
}
```
### 用户修改绑定设备的信息
> * /api/user/watch/changeBind

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * IMEI:requested
>> * watchTelephone:requested
>> * nickname:requested

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
>> * errcode = 8: 设备未被绑定过

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
### 设置GPS定位数据上传时间间隔
> * api/user/watch/locationInterval

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * interval:requested

> * Successful Return
>> * {status}

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
}
```
### 设置亲情号码
> * api/user/watch/addFamilyNumber

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * phoneNumber1:requested
>> * phoneNumber2:
>> * phoneNumber3:
>> * phoneNumber4:

> * Successful Return
>> * {status}

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
}
```
### 获取手表电话号码--对应app‘电话’功能
> * api/user/watch/call

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status}

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
### 恢复出厂设置
> * /api/user/watch/restoreSettings

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
### 重启终端
> * /api/user/watch/restartTerminal

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
### 设置服务器信息
> * /api/user/watch/settingServer

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * address:requested
>> * port:requested

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
### 设置终端语言与时区
> * /api/user/watch/languageSetting

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * languageCode:requested   --zh_CN
>> * timeZone:requested  --Asia/chongqin
>> * UTCTime:requested  --20150101125223

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
### 设置计步器开关
> * /api/user/watch/pedometer

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pedometerStatus:requested --设置计步器开关状态，1 表示开，0表示关

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
### 设置体感接听开关
> * /api/user/watch/bodyInduction

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * bodyInductionStatus:requested --设置开关状态，1 表示开，0表示关

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
### 设置监听开关
> * /api/user/watch/monitor

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * monitorStatus:requested --设置开关状态，1 表示开，0表示关

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
### 设置短信报警开关
> * /api/user/watch/sms

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * smsStatus:requested --设置短信报警开关状态，1 表示开，0表示关

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
### 设置闹钟
> * /api/user/watch/alarmClock

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * alarmClockStatus:requested --设置闹钟开关状态，1 表示开，0表示关
>> * alarmClock:requested --数据格式为:0900,135,1，表示一组闹钟，0900表示早上09:00,135表示周一周三周五，使用24小时制,1表示该组闹钟开启或关闭状态   1表示开启  0表示关闭

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
### 设置设备脱落报警开关
> * /api/user/watch/fallOff

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * fallOffStatus:requested --设置设备脱落报警开关状态，1 表示开，0表示关

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
### 关机
> * /api/user/watch/powerOff

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
### 拨打电话
> * /api/user/watch/phoneCall

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * phoneNumber:requested

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
### 设置设备工作模式
> * /api/user/watch/workModel

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * workModel:requested

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
### 设置GPS工作时间段
> * /api/user/watch/GPSTimeSlot

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * timeSlot:requested --数据格式:0900@1145，表示一组工作时间段，0900@1145表示早上09:00至11:45分隐身，使用24小时制

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
### 设备验证码显示界面
> * /api/user/watch/authCode

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * authCode:requested

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
### 退出设备验证码显示界面
> * /api/user/watch/exitAuthCode

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
### 设置休眠检测时间下行
> * /api/user/watch/sleepDetection

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * sleepDetectionTime:requested  --数据格式:600 : 当设备停止600秒后通知平台设备进入休眠状态，单位：秒

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
### 设备休眠前主动上传休眠状态
> * /api/user/watch/sleepStatus

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * sleepStatus:requested  --数据格式:1 : 表示进入休眠状态，0表示退出休眠状态

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
### 文字下发
> * /api/user/watch/sendWords

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * sendWords:requested

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
### 设置终端地址，紧急电话
> * /api/user/watch/emergencyCall

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * emergencyCall:requested
>> * terminalAddress:requested  --设置终端地址

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
### 开启和关闭上传通话记录
> * /api/user/watch/callRecords

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * callRecordsStatus:requested

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
### 开启和关闭整点心率测试
> * /api/user/watch/heartRateSwitch

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * heartRateStatus:requested

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
### 开启和关闭实时心率测试
> * /api/user/watch/realTimeHeartRate

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * heartRateStatus:requested
>> * heartRateInterval:requested

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
### 查看所有消息
> * /api/user/message/viewAllMessage

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * messageType:requested --消息类型1：问题回复 2：推荐课程 3：推荐书籍

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
  "status": "success",
  "list": [
    {
      "_id": "599565a036e63f1346167fdc",
      "teacherID": "59955d2bbc44c410ea320be2",
      "__v": 0,
      "createAt": "2017-08-17T09:45:04.609Z",
      "state": "1",
      "enrollNum": 0,
      "price": 0,
      "telephone": "",
      "classHours": "",
      "studentsLimit": 0,
      "enrolldeadline": null,
      "classTime": "",
      "endDate": null,
      "startDate": "2010-10-20T11:30:00.000Z",
      "teacherName": "",
      "description": "",
      "title": ""
    },......
  ]
}
```
### 是否显示二级侧边栏的红点
> * /api/user/message/redPoint

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
  "status": "success",
  "reply": true,
  "lesson": true,
  "book": true
}
```
### 改变消息查看状态
> * /api/user/message/changeMessageStatus

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * typeID:requested  --查看内容的ID

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