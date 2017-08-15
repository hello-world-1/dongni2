# 师说 API 文档
6.15文档更新
>* 用户登录接口/accounts/login、/accounts/verify返回字段文档更新

6.7文档更新
>* 课程接口lesson/details,新增返回scheduletext字段，对应直播详情界面课程表内的文字内容

6.6文档更新
>* 新增直播回放列表接口lesson/replaylist,对应用户点击已购买并可回放的直播时，跳转到回放列表页面，接口详情见下方文档

5.31文档更新
>* 新增用户注册或忘记密码时获取验证码的接口/accounts/sendsms，该接口调用成功会返回正确的验证码字段，需要前端接收保存，在之后调用注册或忘记密码接口时由前端对用户输入的验证码字段进行正确性判断，接口详情见下方文档说明
>* 补充用户删除自己发布录播视频的接口lesson/delete说明文档

5.24文档更新
>* 课程详情接口/lesson/details增加返回descriptext字段，接口对应直播详情界面，新字段对应课程详情内容，原返回的description字段对应直播标题
>* 课程详情接口/lesson/details返回的paystate字段，对应该用户对直播课程的报名情况，返回paid，则该用户已经报名了本直播课程，前端详情页面显示已报名；返回unpaid，则用户还未报名本直播课程，前端详情页面应显示报名按钮

5.23文档更新
>* 新增每日一练详情接口/practice/details,用于每日一练列表页点击确定的内容，进入二级详情页面
>*对于新版设计图中的直播课程二级页面中的我要报名，对应调用/bill/create接口，价格为0的直播报名也需要调用本接口，调用接口成功后，会新增返回isnew字段，true为第一次生成订单，false分两种情况(价格为0时，不是第一次生成订单，仍然可以直接跳出支付成功；价格不为0，不是第一次生成订单，但是订单未支付，提醒用户继续支付)

5.18文档更新
>* 用户个人属性配置接口/accounts/setattribute，新增传入province字段，对应用户的目标省份（传入目标省份名，不包括市、省。如：北京、湖南），相关个人信息展示和修改接口也更新了这个字段，login接口也返回新字段，详情见下方说明文档

5.16文档更新
>* 解决部落动态和课程评论中重复点赞的问题，lesson/like和news/like接口新增返回islike字段，true表示操作为点赞，false表示操作为取消赞

5.15文档更新
>* 解决news/list返回列表中，news下方comments列表中每一条comment中返回的评论发起者昵称不是该评论发起者的最新昵称的bug，更改了接口中评论者昵称的获取方式，详情见下方文档

5.12文档更新
>* 新增检测用户是否有新的未读后台消息的接口message/check，用于app中点击侧滑栏对应的消息中心后是否有新消息提示(设计图中的红点)提醒用户，详情见下方文档
>* 新增检测用户是否有新的未读部落动态消息的接口usermessage/check，用于app中点击侧滑栏对应的部落动态后是否有新消息提示(设计图中的红点)提醒用户，详情见下方文档


5.11文档更新
>* 新增后台消息的展示接口message/list，用于app中侧滑栏对应的消息中心内容展示，详情见下方文档
>* 新增部落动态留言删除接口news/comments/delete,用于部落动态中用户删除自己发布的留言
>* 账单显示接口bill/list返回字段调整，返回bill.teacher为账单对应课程的发布者昵称

5.9文档更新
>* 新增每日一练的展示接口practice/list，用于app中每日一练界面的内容展示，详情见下方文档

5.6文档更新
>* 对应新设计图中发布视频后即可分享视频给好友，lesson/uploadvideo接口发布视频成功后新增返回课程图片thumbnails字段，详情见下方

5.5文档更新
>* 新增抽屉导航中我的直播和直播课程页面中我报名的直播对应接口accounts/mylive
>* lesson/list接口新增返回课程的标签字段，接口详细说明见下方

4.28文档更新
>* 个人属性配置接口和个人信息修改接口的学科subject、学段level属性暂时改为单选，接口需要暂时传入单个值

4.27文档更新
>* 个人信息修改接口更新，要求传入新的考试项目item字段，对于之前要求传入的学科subject、学段level字段变更要求，详情见下方借口说明
>* 新增个人属性配置接口/accounts/setattribute，对应二期用户注册后跳转的个人属性（学科，学段，考试项目）配置页面
>* 方便文档查找，把一些早期的接口文档更新日志转到该文档的最后

4.19文档更新
>* 课程新填标签type1、type2、level、subject，字段详细解释补充到相关接口说明
>* 发布录播课程接口需要传入新的标签字段，课程展示相关页面也会返回新添加的字段

4.13更新说明
>* 新增accounts/newaccount接口，用于现在的注册登录逻辑，用于简化判断手机号是否已经在我们平台注册过
>* user添加item属性值，accounts/getinfo等接口添加这个参数


## 服务器信息
**接口 :** http://liangshiba.com:8090

**匿名用户：** 
`userID:"57c46e700d21db303f349c55"`
`token:"f6d9270a24ea961d4371547444e2a9736348b98bc795c16c7d64cdfe002687dec1909439751cb5f3ada6e4ebdbc3d2efa8efa33e46fae84b55cc02845c5791f2"`




## 接口说明
Requests use POST method, return JSON (all the key-value in string format).

All the error return json formated as:

```
{text, errcode, status}
if status == "success" means success
if status == "error" means error
```

## 用户接口
### 用户使用手机账户登陆
> * /accounts/login

> * Input Parameters
>> * telephone:requested
>> * password:requested

> * Successful Return
>> * {user:{userID,token,avatar,nickname,description,type,subject,level,item,province,sex},status}
>> * type: "student"代表学生，"teacher" 代表教师(用户登录后返回的item字段为“”或null，应继续引导用户进入个人属性配置页面)

> * Error Return
>> * errcode = 1: 账号不存在
>> * errcode = 2: 密码不正确

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "nickname": "老师",
    "description": "这是个人简介",
    "type": "student",
	"subject": "1",
	"level": "1",
	"item": "0",
	"province":"北京",
	"sex": "male"
  }
}
```

### 用户注册
> * /accounts/register

> * Input Parameters
>> * telephone:requested
>> * password:requested
>> * invitecode:optional
>> * sex:optional("female"代表女性，默认"male"为男)
>> * level:optional
>> * subject:optional
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {user:{userID},status}

> * Error Return
>> * errcode = 1: 函数调用异常
>> * errcode = 2: 邀请码不正确
>> * errcode = 3: 此手机号已经注册

> * example

```
{"user":{"userID":"1001"},"status":"success"}
```

### 判断用户手机号是否为新用户
> * /accounts/newaccount

> * Input Parameters
>> * telephone:requested

> * Successful Return
>> * {status,telephone,isnew}
>> * isnew: true代表为新用户，没注册过；false代表该手机号已经注册过

> * Error Return
>> * errcode = 1: 函数调用异常

> * example

```
{
  "status": "success",
  "telephone": "17712345677",
  "isnew": false
}
```


### 用于获取手机短信验证码
> * /accounts/sendsms

> * Input Parameters
>> * telephone:requested

> * Successful Return
>> * {status,code}//success
>> * code status为success时，code为正确的验证码

> * Error Return
>> * {status,code,msg}//error
>> * status为error时，code为第三方短信平台返回的错误码，msg为第三方短信平台返回的错误信息

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

### 用户忘记密码
> * /accounts/forgetpwd

> * Input Parameters
>> * telephone:requested
>> * newpassword:requested


> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 1: 函数调用异常
>> * errcode = 2: 该用户尚未注册


> * example

```
{"status":"success"}
```


### 用户修改密码
> * /accounts/changepassword

> * Input Parameters
>> * password:requested
>> * newpassword:requested
>> * re_newpassword:requested
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID}}

> * Error Return
>> * errcode = 0: 免登陆体验账号，不提供修改密码服务
>> * errcode = 1: 此手机号已经注册
>> * errcode = 2: 密码不正确或两次输入新密码不同

> * example

```
{"status":"success","user":{"userID":"1001"}}
```

### 注销登录
> * /accounts/logout

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {status,user:{userID，token}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","user":{"userID":"1001","token":"e59cc2dfab213b4cd1d3b562bdc22e56ad26556034539e01742a5c81396af613abd2f7ce75577e724b15e46af0ce6894c4dff0f2ca4c24bf6bd636290d161499"}}
```

### 修改头像
> * /accounts/changeavatar

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * file.name:requested
>> * file.path:requested
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {status,user:{userID，avatar}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","user":{"userID":"1001","avatar":"/images/avatars/avatar_sample.jpg"}}
```

### 获取个人信息
> * /accounts/getinfo

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID，avatar，nickname，description,type,level,subject,item，province,school,style,sex,education}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58340eb2a33d6b1c28e68b67",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "nickname": "学生",
    "description": "这是个人简介",
    "type": "teacher",
    "level": "小学",
    "subject": "语文",
	"item":"0",
	"province":"湖南",
    "school": "XXXX学校",
    "style": "这里是授课风格介绍",
    "sex": "male",
    "education":"高中"
  }
}
```

### 个人属性配置接口（针对学科学段考试项目）
> * /accounts/setattribute
> 
**个人属性配置接口参数要求和修改个人信息接口要求一致**

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * subject:requested//学科 0:"语文",1:"数学",2:"英语",3:"物理",4:"化学",5:"生物",6:"历史",7:"地理",8:"政治"（"品德"）,9:"体育",10:"美术",11:"信息技术",12:"音乐",13:"其他",14:"综合",15:"科学"
>> * item:requested//考试项目 0 代表教师资格证面试/ 1 代表是 教师招聘
>> * level:requested//学段 3:'高中',2:'初中',1:'小学',0:'幼儿园'
>> * province:requested//目标省份

> * Successful Return
>> * {status,user:{userID,level,subject,item,province}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58340eb2a33d6b1c28e68b67",
	"level":"0",
	"subject":"1",
	"item":"0",
	"province":"北京"
  }
}
```


### 修改个人信息
> * /accounts/changeinfo
> 
**<del>个人信息修改接口现在对于学科subject、学段level支持多选，接口传入时要求传入多个参数拼接的字符串（不同学科或学段间用空格隔开）作为属性值，如：选择学科对应语文、数学和物理时，传入的subject属性应为“0 1 3”</del>**

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * description:requested
>> * username:requested
>> * school:requested
>> * subject:requested//学科 0:"语文",1:"数学",2:"英语",3:"物理",4:"化学",5:"生物",6:"历史",7:"地理",8:"政治"（品德）,9:"体育",10:"美术",11:"信息技术",12:"音乐",13:"其他",14:"综合",15:"科学"
>> * item:requested//考试项目 0 代表教师资格证面试/ 1 代表是 教师招聘
>> * level:requested//学段 3:'高中',2:'初中',1:'小学',0:'幼儿园'
>> * sex:requested
>> * province:requested
>> * style:requested
>> * education:requested //初中，高中，中专，大专，本科，硕士，博士，博士后，其他

> * Successful Return
>> * {status,user:{userID,nickname,description,sex}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58340eb2a33d6b1c28e68b67",
	"nickname": "abc",
	"description": "个人描述",
	"sex": "male"
  }
}
```

### 我的视频接口
> * /accounts/myvideo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,commentnums,likenums}...]}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "58462cbc1849195616f1283a",
      "price": 0,
      "updated": "2016-12-06T03:13:00.944Z",
      "description": "课程描述",
      "videoType": "record",
      "videoID": "F7845E75DEBC6D3E9C33DC5901307461",
      "thumbnails": "1ab929556253136862a10ebcf5719f9f1480993980751.jpg",
	  "commentnums":1,
	  "likenums":2
    },
	...
  ]
}
```

### 我(报名)的直播接口
> * /accounts/mylive

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested（页码 可不传）


> * Successful Return
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,status,billID,liveInfo：{liveRoomID,startdate,enddate,classstarttime,classendtime,enrolldeadline,classhours,
studentslimit},livePassword:{teacherCCpassword,studentCCpassword}}...]}}...]}
>> * status对应当前用户对该下单直播的支付状态,true为已支付完成，false为未支付
>> * livePassword：学生的密码如果未支付状态，那么livePassword为空（为方便调试，密码都是shishuo ,即使没有支付接口都为空，客户端这边也能先调试）

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "585c9b711d63643273cf1c72",
      "price": 1,
      "updated": "2016-12-23T03:35:13.540Z",
      "description": "这是一个测试",
      "videoType": "live",
      "videoID": "0",
      "thumbnails": "/images/lesson_thumbnails/sample.jpg",
      "billID": "5860b9e9e4f58c5c0e542103",
      "status": true,
      "liveInfo": {
        "liveRoomID": "86395DCD7AD71ACB9C33DC5901307461",
        "startdate": "2016-01-01T16:00:00.000Z",
        "enddate": "2016-01-02T16:00:00.000Z",
        "classstarttime": "8:00",
        "classendtime": "",
        "enrolldeadline": "2015-12-31T16:00:00.000Z",
        "classhours": 12,
        "studentslimit": 20
      },
      "livePassword": {
        "teacherCCpassword": "shishuo",
        "studentCCpassword": "shishuo"
      },
      "commentnums": 0,
      "likenums": 0
    }
	...
  ]
}
```


### 检测用户是否有新的部落动态消息
> * /usermessage/check

> * Input Parameters
>> * userID:requested
>> * token:requested


> * Successful Return
>> * {status,hasnew}
>> * hasnew为布尔类型，true为有新的消息，false为没有新消息

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "hasnew": true
}
```

### 检测用户是否有新的系统消息
> * /message/check

> * Input Parameters
>> * userID:requested
>> * token:requested


> * Successful Return
>> * {status,hasnew}
>> * hasnew为布尔类型，true为有新的消息，false为没有新消息

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "hasnew": true
}
```


### 我要上课/我要听课接口
> * /accounts/mylessons

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested
>> * pagestart:requested


> * Successful Return
>> * student:
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,status,billID,liveInfo：{liveRoomID,startdate,enddate,classstarttime,classendtime,enrolldeadline,classhours,
studentslimit},livePassword:{teacherCCpassword,studentCCpassword}}...]}}...]}
>> * teacher:
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,liveroom,livePassword:{teacherCCpassword,studentCCpassword}}...]}
>> * livePassword：老师和学生的密码如果未支付状态，那么livePassword为空（为方便调试，密码都是shishuo ,即使没有支付接口都为空，客户端这边也能先调试）

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
student：
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "585c9b711d63643273cf1c72",
      "price": 1,
      "updated": "2016-12-23T03:35:13.540Z",
      "description": "这是一个测试",
      "videoType": "live",
      "videoID": "0",
      "thumbnails": "/images/lesson_thumbnails/sample.jpg",
      "billID": "5860b9e9e4f58c5c0e542103",
      "status": true,
      "liveInfo": {
        "liveRoomID": "86395DCD7AD71ACB9C33DC5901307461",
        "startdate": "2016-01-01T16:00:00.000Z",
        "enddate": "2016-01-02T16:00:00.000Z",
        "classstarttime": "8:00",
        "classendtime": "",
        "enrolldeadline": "2015-12-31T16:00:00.000Z",
        "classhours": 12,
        "studentslimit": 20
      },
      "livePassword": {
        "teacherCCpassword": "shishuo",
        "studentCCpassword": "shishuo"
      },
      "commentnums": 0,
      "likenums": 0
    }
	...
  ]
}
```
```
teacher：
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "584241cc812603d314ec08d0",
      "price": 1,
      "updated": "2016-12-03T03:53:48.438Z",
      "description": "的点点滴滴",
      "videoType": "live",
      "videoID": "0",
      "thumbnails": "/images/lesson_thumbnails/sample.jpg",
      "liveroom": "D97E93E203AF42A19C33DC5901307461",
      "livePassword": {
        "teacherCCpassword": "shishuo",
        "studentCCpassword": "shishuo"
      }
    }
	...
  ]
}
```

### 第三方用户信息登录接口

> * /accounts/verify
> 
> * Input Parameters
>> * userID:requested(用户账号在第三方平台对应的userID)
>> * avatar:requested(用户第三方账号对应的头像url)
>> * username:requested(用户第三方账号的用户名)
>> * sex:requested(用户第三方账号的性别信息，应根据实际情况转换成我们后台对应的male，female)



> * Successful Return
>> * {status,user:{userID,token,avatar,nickname,description,type,subject,level,item,province,sex}

> * Error Return
>> * errcode = 0: 登录失败
>> * errcode = 1: 用户登录信息错误

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "nickname": "老师",
    "description": "这是个人简介",
    "type": "student",
	"subject": "1",
	"level": "1",
	"item": "0",
	"province":"北京",
	"sex": "male"
  }
}
```


## 用户反馈接口

###发送反馈信息

> * /suggestion/create
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * content:requested



> * Successful Return
>> * {status,suggestion:{suggestionID}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "suggestion": {
    "suggestionID": "58353e647050a215682fd2b9"
  }
}
```

## 消息中心

###消息中心展示
侧滑栏“消息中心”对应后台消息展示


> * /message/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {messages:{messageID,updated,title,content},status}
>> * updated发布时间、title消息标题、content消息内容



> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取失败

> * example

```
{
  "status": "success",
  "messages": [
    {
      "messageID": "59113a7b82e6f41d344869b2",
      "updated": "2017-05-09T03:41:47.706Z",
      "title": "后台消息标题",
      "content": "这是一条供测试使用的系统后台消息"
    },
    {
      "messageID": "59113a7982e6f41d344869b1",
      "updated": "2017-05-09T03:41:45.360Z",
      "title": "后台消息标题",
      "content": "这是一条供测试使用的系统后台消息"
    },
	...
  ]
}
```


## 每日一练

###查看每日一练
每日一练界面展示


> * /practice/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {practices:{practiceID,updated,title,content},status}
>> * updated发布时间、title每日一练题目



> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取每日一练失败

> * example

```
{
  "status": "success",
  "practices": [
    {
      "practiceID": "584241cc812603d314ec08d0",
      "updated": "2016-12-03T03:53:48.438Z",
      "title": "请对小学语文《荷塘月色》进行试讲",
      "content": "对于小学语文课程《荷塘月色》，练习试讲课的内容"
    },
	...
  ]
}
```



###查看每日一练
每日一练详情


> * /practice/details
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * practiceID:requested

> * Successful Return
>> * {practice:{practiceID,updated,title,content},status}
>> * updated发布时间、title每日一练题目



> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取每日一练失败

> * example

```
{
  "status": "success",
  "practice": 
    {
      "practiceID": "584241cc812603d314ec08d0",
      "updated": "2016-12-03T03:53:48.438Z",
      "title": "请对小学语文《荷塘月色》进行试讲",
      "content": "对于小学语文课程《荷塘月色》，练习试讲课的内容"
    }
}
```


## 账单信息

###创建账单


1.购买课程时创建创建账单
2.自己上传的课程被别人购买时创建账单


> * /bill/create
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * money:requested
>> * lessonID:requested


> * Successful Return
>> * {status,billID,isnew}//isnew订单是否第一次生成（还是之前已存在该订单）

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success"，'billID':'00'，'isnew':true}
```

###账单列表

> * /bill/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,bills:[{billID,money,updated,teacher,status,description,isout]}
>> * bill.teacher:账单对应课程发布老师的昵称、bill.status:账单支付状态、bill.isout:账单对当前用户是支出还是收入

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "bills": [
    {
      "billID": "582bb938e8f2761e8597a8ef",
      "money": 5,
      "updated": "2016-11-16T01:41:12.233Z",
	  "status":true,
      "teacher": "王老师",
      "description": "直播课程01",
      "isout": true
    },
	...
  ]
}
```


## 课程公告

### <del>创建(发布)课程公告</del>  <font color=red>这个接口现在被弃用了</font>


> * /announcement/create
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * classtimestart:requested(开课时间)
>> * classtimeend:requested(结课时间)
>> * classtime:requested(上课时间)
>> * money:requested
>> * liveaddress:requested
>> * limit:requested(限制人数)
>> * description:requested
>> * expirydate:requested(报名截止日期)
>> * classhours:requested(学时数)


> * Successful Return
>> * {status,announcement:{announcementID,classtimestart,classtime}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","announcement": {"announcementID":"5822c9e584133412f82493da","classtimestart":"2016-10-12T00:00:00.000Z","classtime":"2016-10-12T03:22:00.000Z"
  }}
```


### <del>显示课程公告</del>  <font color=red>这个接口现在被弃用了</font>


> * /announcement/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,announcements:[{announcementID,classtimestart,classtimeend,classtime,liveaddress,limit,updated,classhours,,expirydate,description,money,user:{userID,avatar,nickname}}]}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "announcements": [
    {
      "announcementID": "5822c9e584133412f82493da",
      "classtimestart": "2016-10-12T00:00:00.000Z",
      "classtimeend": "2016-11-22T00:00:00.000Z",
      "classtime": "2016-10-12T03:22:00.000Z",
      "liveaddress": "www.zhibodizhi.com",
      "limit": 80,
      "updated": "2016-11-09T07:01:57.540Z",
      "classhours": 12,
      "expirydate": "2016-10-22T00:00:00.000Z",
      "description": "这是一条公告",
      "money": 20,
      "user": {
        "userID": "580f259bd424e61ec043beb0",
        "avatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
        "nickname": "老师"
      }
    }
	...
  ]
}
```


## 热门页面
###获取课程列表:


1. 热门页面下的 师说录制的课程列表
2. 热门页面下的 学生录制的课程列表
3. 磨课的视频专区的课程列表

> * /lesson/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:optional type==0 对应“热门名师”的免费视频课程，type==1代表“热门考生”的学生发布视频, type==2 代表“磨课视频课程”的教师发布录播视频，type==3代表“磨课直播课程”的教师发布直播课程（此接口不传type参数则显示所有课程，type传入空值与type==0是一种情况）
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {lessons:{lessonID,price,updated,description,videoType,thumbnails,commentnums,likenums,purchased,liveInfo:{liveRoomID,startdate,enddate,classstarttime,classendtime,enrolldeadline,classhours,studentslimit},livePassword:{teacherCCpassword,studentCCpassword}，address,type1,type2,subject,level,teacher:{teacherID,avatar,nickname,teacherType}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像,description:课程描述,price:价格
>> *  videoType:record代表录播，live 代表直播
>> * liveInfo：直播房间号、开始日期等信息



> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "584241cc812603d314ec08d0",
      "price": 1,
      "updated": "2016-12-03T03:53:48.438Z",
      "description": "的点点滴滴",
      "videoType": "live",
      "thumbnails": "sample.jpg",
      "thumbnailswidth": 587,
      "thumbnailsheight": 725,
      "commentnums": "0",
      "likenums": "0",
      "purchased": 0,
      "liveInfo": {
        "liveRoomID": "D97E93E203AF42A19C33DC5901307461",
        "startdate": "2016-12-03T00:00:00.000Z",
        "enddate": "2016-12-03T00:00:00.000Z",
        "classstarttime": "11:53:30",
        "classendtime": "12:53:00",
        "enrolldeadline": "2016-12-04T00:00:00.000Z",
        "classhours": 100,
        "studentslimit": 100
      },
	  "livePassword": "",
      "address": "",
      "type1": "",
      "type2": "",
      "subject": "",
      "level": "",
      "teacher": {
        "teacherID": "58340105a33d6b1c28e68b66",
        "avatar": "/images/avatars/95791d20-b2eb-11e6-b6af-1d3916fb4a28.jpeg",
        "nickname": "ybb"
      }
    },
	...
  ]
}
```


###获取视频详情
(直接获取了评论列表）
> * /lesson/details

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested

> * Successful Return
>> * {lesson:{lessonID,price,updated,description,thumbnails,commentnums,likenums,comments,videoType,descriptext,scheduletext,teacher:{teacherID,avatar,nickname},paystate,videoID,liveInfo:{liveRoomID,startdate,enddate,classstarttime,classendtime,enrolldeadline,classhours,studentslimit},livePassword:{teacherCCpassword,studentCCpassword}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像,description:课程标题,descriptext:课程详情描述,scheduletext：课程表描述,price:价格
>> *  videoType:record代表录播，live 代表直播
>> * paystate: paid 已经支付过，unpaid 未支付
>> * liveInfo：直播房间号、开始日期等信息
>> * livePassword：直接返回老师和学生的直播间密码（为方便调试，密码都是shishuo）


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{
  "status": "success",
  "lesson": {
    "lessonID": "58302ca4663be359fb439ecd",
    "price": 10,
    "updated": "2016-11-19T10:42:44.800Z",
    "description": "全国大学生英语竞赛",
    "thumbnails": "/images/lesson_thumbnails/sample.jpg",
    "commentnums": "0",
    "likenums": "0",
    "comments": [
      {
        "_id": "586f2d023d7378305552f05f",
        "user": {
          "_id": "585f6a3b1d63643273cf1c87",
          "nickname": "杨老师",
          "avatar": "/images/avatars/4039fba0-d97d-11e6-8119-15ee789511ec.jpg"
        },
        "content": "声音小点",
        "type": "text",
        "username": "杨老师"
      }
    ],
    "videoType": "live",
    "descriptext": "课程详情描述",
    "scheduletext": "课程表描述",
    "teacher": {
      "teacherID": "582baf6d7f91281c6d98af1e",
      "avatar": "/images/avatars/avatar_sample.jpg",
      "nickname": "老师"
    },
    "paystate": "owner",
    "videoID": "0",
    "liveInfo": {
      "liveRoomID": "5BE6541A22FED0B19C33DC5901307461",
      "startdate": "2016-11-19T00:00:00.000Z",
      "enddate": "2016-11-20T00:00:00.000Z",
      "classstarttime": "20:00:00",
      "classendtime": "21:00:00",
      "enrolldeadline": "2016-11-17T00:00:00.000Z",
      "classhours": 2,
      "studentslimit": 100
    },
    "livePassword": {
      "teacherCCpassword": "shishuo",
      "studentCCpassword": "shishuo"
    }
  }
}
```

###给课程评论
> * /lesson/comments/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested
>> * content:requested 评论内容
>> * type:requested 评论类型 text 代表 文本， sound 代表声音，用 base64 编码在content 表示
>> * replyto: optional 回复给用户的 userID
>> * replytoName: optional 回复给用户的userID

> * Successful Return
>> * {status,commentID,commentfrom,commentUserAvatar,lessonID}


> * Error Return
>> * errcode = 1: 用户不存在
>> * errcode = 2: 权限认证错误，请重新登陆
>> * errcode = 3: 评论保存失败
>> * errcode = 4: lessonID对应的课程不存在

> * example

```
{
  "status": "success",
  "commentID": "582534c798d7b60e00a36cd1",
  "commentfrom": "老师",
  "commentUserAvatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
  "updated": "2016-11-11T03:02:31.848Z",
  "lessonID": "57ca1145f418b4796909724f"
}
```


###删除录播视频
> * /lesson/delete

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested

> * Successful Return
>> * {status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 数据库查询失败
>> * errcode = 3: lesson价格不为0，且已被购买，不能删除lesson
>> * errcode = 4: lessonID对应的课程不存在

> * example

```
{
  "status": "success"
}
```



##评论
### <del>获取评论列表</del>  <font color=red>这个接口现在被弃用了</font>
 
> * /comment/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested: type == 0 代表视频课程， type == 1 代表直播, type == 2 代表部落里的评论
>> * contentID:requsted 相关课程的ID 或者 直播间的ID 或者 部落的评论
>> * pagestart:optional 默认为 0，每次加载 20个评论

> * Successful Return
>> * {comment:{commentID,commentContent,user:{userID,nickname}},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{"comment":{"commentID":"1001","commentContent":"做的非常好",user:{"userID":"12","nickname":"刘老师"}},"status":"success"}
```

### <del>发表新评论</del>  <font color=red>这个接口现在被弃用了</font>
> * /comment/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested: type == 0 代表视频课程， type == 1 代表直播, type == 2 代表部落里的评论
>> * contentID:requsted 相关课程的ID 或者 直播间的ID 或者 部落的评论
>> * replyID:optional 如果回复某条评论，那么为这条评论的ID，否则为空 ]
>> * content:requested 评论的内容

> * Successful Return
>> * {comment:{commentID},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{"comment":{"commentID":"1001"},"status":"success"}
```


##练习
### 抽题，不创建题目（这样更合理）
<del>新建题目，并进行抽题</del>

从相应类别下的题目中随机抽取一题
> * /lesson/choose
> * <del>/lesson/create</del>

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonType1:optional ` 0 代表教师资格证面试/ 1 代表是 教师招聘`
>> * lessonType2:optional `0：说课，1：片段教学，2：试教，3：结构化面试 4：答辩`
>> * lessonLevel:optional: `3:'高中',2:'初中',1:'小学',0:'幼儿园'`
>> * lessonSubject:optional: `0:"语文",1:"数学",2:"英语",3:"物理",4:"化学",5:"生物",6:"历史",7:"地理",8:"政治"（"品德"）,9:"体育",10:"美术",11:"信息技术",12:"音乐",13:"其他",14:"综合",15："科学"`


> * Successful Return
>> * {question:{questionID,questionContent,thumbnails,preparationtime,answertime},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{
  "status": "success",
  "question": {
    "questionID": "582baf1e7f91281c6d98af1c",
    "questionContent": "乌鸦有几只",
    "thumbnails": "/images/question_thumbnails/sample.jpg",
    "preparationtime": 10,
    "answertime": 40
  }
}
```

### 创建直播间
> * /lesson/createlive

> * Input Parameters

```
{
	userID:582baf6d7f91281c6d98af1e,
	token:466d86fb189a71590c32c210aad927eb33fc9927ed98031d02c3338733bc618939c16a75430c1214a25ef65eabf976ded587e2b854d93e576bcb74b6f522652e,
	price:10,
	startdate:2016-11-19,        //开始日期
	enddate:2016-11-20,         //结束日期
	classstarttime:20:00:00,    //课程开始时间
	classendtime:21:00:00,      //课程结束时间
	enrolldeadline:2016-11-17, //报名截止日期
	classhours:2,              //课时
	studentslimit:100,         //学生限制数量
	description:"全国大学生英语竞赛",
}
```

> * successful return

```
{
  "status": "success",
  "lessonid": "582ff0e853792f5049670fe6",
  "liveroomid": "3F1FB53711E5B9159C33DC5901307461",
  "teacherpass": "shishuo"
}
```
> * Error Return
> 
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 没有此用户
>> * errcode = 3: 创建直播间错误
>> * errcode = 4: 课程保存错误



###上传录播的视频

> * /lesson/uploadvideo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * videoID:requested  videoID 为cc后台记录的视频ID，用来后续访问
>> * thumbnails: requested 生成截图传给后台
>> * price: optional 老师设置的课程价格，可为空
>> * type1: requested 课程标签1，0 代表教师资格证面试/ 1 代表是 教师招聘
>> * type2: requested 课程标签2，1：说课，2：试教，3：结构化面试 4：答辩
>> * level: requested 课程对应学段，3:'高中',2:'初中',1:'小学',0:'幼儿园'
>> * subject: requested 课程对应学科，0:"语文",1:"数学",2:"英语",3:"物理",4:"化学",5:"生物",6:"历史",7:"地理",8:"政治"（"品德"）,9:"体育",10:"美术",11:"信息技术",12:"音乐",13:"其他",14:"综合",15:"科学"

> * Successful Return
>> * {status,lesson:{thumbnails}}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 课程号不存在
>> * errcode = 3: 保存失败
>> * errcode = 4: 保存失败

> * example

```
{
	"status":"success",
  "lesson": {
    "thumbnails": "/images/lesson_thumbnails/sample.jpg"
	}
}
```

### 给课程评论
> * /lesson/comments/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested
>> * content: requested
>> * type: requested
>> * replyto: optional
>> * replytoName:optional


> * Successful Return
>> * {status,commentID,commentfrom,commentUserAvatar,lessonID}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "commentID": "582534c798d7b60e00a36cd1",
  "commentfrom": "老师",
  "commentUserAvatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
  "updated": "2016-11-11T03:02:31.848Z",
  "lessonID": "57ca1145f418b4796909724f"
}
```

### 给课程点赞

> * /lesson/like

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested


> * Successful Return
>> * {lesson:{lessonID,likenums},status,islike}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 数据库查询错误

> * example

```
{
  "status": "success",
  "lesson": {
    "lessonID": "57d2ce18b64d1db00aa8400d",
    "likenums": 14
  },
  "islike":true
}
```

### 直播回访列表接口

> * /lesson/replaylist

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * liveRoomID: requested 对应直播的直播间roomid


> * Successful Return
>> * {replays:{replayID,startTime,endTime,recordStatus},status,count}
>> * count 回放条数
>> * replayID 回放对应的liveid，前端用户放在CCsdk中拼接成回放链接
>> * startTime 回放开始时间
>> * endTime 回放结束时间
>> * recordStatus 回放在CC后台的录制状态，0表示录制未结束，1表示录制完成

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 数据库查询错误
>> * errcode = 3: 获取回放列表失败

> * example

```
{
  "status": "success",
  "count": 2,
  "replays": [
    {
      "replayID": "3CD8B702D7D51B93",
      "startTime": "2017-04-22 19:14:06",
      "endTime": "2017-04-22 20:29:26",
      "recordStatus": 1
    },
    {
      "replayID": "8D92FDE982C57D2D",
      "startTime": "2017-04-21 19:25:40",
      "endTime": "2017-04-21 21:05:10",
      "recordStatus": 1
    }
  ]
}
```


###获取标准答案  <font color=green>暂时没实现</font>

> * /lesson/getanswers

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested


> * Successful Return
>> * {lessons:{lessonID,thumbnails,likenums,commentnums,teacher:{teacherID,avatar,nickname}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{"lessons":{"lessonID":"1001","thumbnails":"/media/lessons/thumbnails/1.jpg","likenums":"2000","commentnums":"10000","teacher":{"teacherID":"1001","avatar":"/media/avatars/1.jpg","nickname":"张老师"}},"status":"success"}
```

## 磨课
###视频专区，获取视频列表：
见 热门页面 >获取课程列表:

###<del>直播专区，获取直播列表</del>
<font color="red">(暂时被弃用，直播和课程合并在一起）</font>

> * /live/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {lives:{liveID,currentViewerNum,ccVideoID},status}
>> * currentViewerNum:当前观众人数,ccVideoID:cc直播的视频ID


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{"lives":{"liveID":"10001","currentViewerNum":"1560","ccVideoID":"12334"},"status":"success"}
```


## 部落
###获取部落 新动态

> * /news/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pageStart:requested 默认从0开始，每次加载10个


> * Successful Return
>> * {newses:{newsID,images,likenums,likeusers:[{userID,nickname}]，commentnums,comments:[{_id,user:{_id:nickname},username,type,content,replytoName,replyto}],updated,user:{userID,avatar,nickname}},status}
>> * images 可以为空数组，comments中的 replyto 和 replytoName 如果没有回复则不存在该字段

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "newses": [
    {
      "newsID": "583938ca67a9c3f4ef34fb21",
      "updated": "2016-11-26T07:24:58.666Z",
      "content": "这是一个新鲜事",
      "commentnums": 0,
      "likenums": 0,
      "likeusers": [],
      "images": [
        "3fd16501df2fbe45d9171a68623f0b991480145098643.jpeg",
        "5eb271409dfe9f828f449b96edbc63af1480145098649.png"
      ],
      "comments": [],
      "user": {
        "userID": "582bada68e36e61c1be44f47",
        "avatar": "/images/avatars/avatar_sample.jpg",
        "nickname": "老师"
      }
    },
    {
      "newsID": "58393759d5a82cf488cc1a83",
      "updated": "2016-11-26T07:18:49.353Z",
      "content": "这是一个新鲜事",
      "commentnums": 0,
      "likenums": 0,
      "likeusers": [],
      "images": [
        "9d004fc84b635ff5448952f0b6e4910f1480144729335.jpeg"
      ],
      "comments": [
        {
          "_id": "58cb9e887c700173e298cfbe",
          "user": {
            "_id": "581aab9047f22d2812bde8ab",
            "nickname": "啦啦啦啦啦"
          },
          "content": "😁",
          "type": "text",
          "username": "sjy66666"
        }
      ],
      "user": {
        "userID": "582bada68e36e61c1be44f47",
        "avatar": "/images/avatars/avatar_sample.jpg",
        "nickname": "老师"
      }
    }
   ]
 }
```

###发表一条新动态

> * /news/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * content: optional 文本内容
>> * images:requested 动态图片列表，是一个文件数组，如果没有图片则不用传或者为空


> * Successful Return
>> * {news:{newsID},status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "news": {
    "newsID": "57d2ce18b64d1db00aa8400d"
  }
}
```



###删除一条已发布动态

> * /news/delete

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newsID: requested



> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 1: 用户登录信息错误，请重新登陆
>> * errcode = 2: 数据库操作函数异常

> * example

```
{
  "status": "success"
}
```

### 给朋友圈点赞

> * /news/like

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newsID: requested


> * Successful Return
>> * {news:{newsID},status,islike}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "news": {
    "newsID": "57d2ce18b64d1db00aa8400d"
  },
  "islike":true
}
```


### 给朋友圈评论
> * /news/comments/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newsID: requested
>> * content: requested
>> * type: requested
>> * replyto: optional
>> * replytoName:optional


> * Successful Return
>> * {commentID,newsID,commentfrom,commentUserAvatar,updated,status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "commentID": "582534c798d7b60e00a36cd1",
  "commentfrom": "老师",
  "commentUserAvatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
  "updated": "2016-11-11T03:02:31.848Z",
  "newsID": "57d2ba2afe5081244697a5c0"
}
```

### 删除给朋友圈评论
> * /news/comments/delete

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newsID: requested
>> * commentID: requested


> * Successful Return
>> * {status}
>> * 前端由news/list返回的comment.user._id(评论发布者的userID)判断用于只能对自己的评论进行删除操作，由list接口返回的newsID作为newsID、comment._id字段作为commentID传入，对应具体动态的具体评论

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success"
}
```


##支付课程
### 支付
> * /pay/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested


> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success"
}
```
### 查看某个用户是否已经支付某个课程
> * /pay/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested


> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案
>> * errcode = 3：获取状态失败
>> * errcode = 4: 没有支付过

> * example

```
{
  "status": "success"
}
```


##教师端
###发布课程，
见 "上传课程的视频、价格" 接口

###<del>开始直播</del>
<font color="red">(暂时被弃用，直播和课程合并在一起）</font>
> * /live/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * ccLiveID:requested
>>


> * Successful Return
>> * {live:{liveID}},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆


> * example

```
{"live":{"liveID":"1001},"status":"success"}
```


## 消息

### 获取当前动态(尚未开放）
>* /notify/list
> * Input Parameters
>> * userID:requested
>> * token:requested


> * Successful Return
>> * {notify:{notifyID,content,type},status}
>> * type: 0: 新的评论， 1: 新的赞， 2: 新的购买

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆

> * example

```
{"notify":{"notifyID":"1001","content":"有人赞了您的课程荷塘月色","type":"1"},"status":"success"}
```


##早些时间的接口更新日志

2.25更新说明
>* 发布直播课程接口新增传入address字段，对应线下课程上课地点，不传此字段默认值为空
>* lesson/list接口中返回address值


1.19更新说明
>* bill/webhook支付金额与本地课程价格比对的bug修复
>* accounts/logout接口新增对免登陆账号的判断，对于体验账号退出登录时不会更改该账号在数据库中的token值
>* 更新用于第三方登录使用的accounts/verify接口相关说明

1.16更新说明
>* lesson/list接口增加返回purchased字段，对应课程已购买人数
>* lesson/details接口返回的comments中每条comment中增加返回一个user对象，包括该评论者的头像avatar和昵称nickname，
>具体说明见下方文档

1.10更新说明
>* 后台lesson/uploadvideo接口，现要求增加传入录制视频的description，保存视频描述信息（之前的后台程序未保存该字段）
>* accounts/changeavatar接口和accounts/changeinfo接口合并，修改个人信息分为两种情况，传入新头像文件和不传文件（头像无修改），统一使用accounts/changeinfo接口，传入头像文件时的文件对应fieldname应为avatar，完成前端一键修改头像和用户个人信息的功能

1.6更新说明
>* 后台lesson/list接口，增加返回livePassword字段，当传入type为3对应前端磨课直播课程时，且直播课程price为0时增加返回对应直播间的老师和学生密码，其余情况返回livePassword为空，方便用户点击免费直播课程直接进入对应直播间，接口使用文档已更新

1.3更新说明
>* 后台忘记密码对应接口accounts/forgetpwd,接口详细说明见下方文档，前端需要判断两次输入新密码是否一致，以及保证用户通过短信验证后调用修改密码接口


12.26更新说明
>* 后台新增部落动态删除接口news/delete,接口详细说明见下方文档，前端应设置用户只能对自己发布的动态消息调用删除接口的权限
>* accounts/mylessons接口显示学生已购买课程时，增加返回直播课程相关的liveInfo

12.14更新说明：
>* accounts/mylessons接口对于学生显示已购买课程列表（创建订单，不一定支付完成），现在增加返回对应账单的billID，便于前端处理未支付完成订单，点击跳转到支付界面即可，现在增添返回对应视频的点赞数和评论数，均为真实数据
>* accounts/myvideo接口修复了部分返回图片不能正常显示的bug，现在增添返回对应视频的点赞数和评论数，均为真实数据

12.13更新说明：
>* lesson/list、lesson/details、news/list接口返回的likenums、commentnums现在不会一直为“0”，返回真实数据
>* CC后台上传的录播视频已全部关联到我们的服务端，挂在CC上的视频返回的thumbnail直接使用CC接口返回的，需要直接获取图片，我们后台原本返回的还需要拼接url
>* lesson/list接口不再返回课程图片的宽高
>* news/create接口现在支持多张图片上传，对应图片文件的fieldname应为newsimages，多张图片构成数组供后台解析

12.9更新说明：
>* lesson/list接口 现在根据传入type值不同显示不同类别的课程，具体内容见下方接口说明


12.7更新说明：
>* lesson/list接口返回增加liveInfo
>* accounts/myvideo接口返回增加videoID
>* accounts/mylessons接口返回增加videoID、livePassword
>* 最新修改的接口需求于返回字段说明的更新，与运行的后台程序保持一致


12.3更新说明：
>* bill/create接口 调用时根据当前userID和lessonID判断是否已生成过订单，已生成的话会返回报错errcode：5和订单支付状态，避免重复订单

11.26更新说明：

>* 更改了 抽题 /lesson/choose 和 /lesson/uploadvideo的bug
>* getinfo 和 setinfo增加了 教育信息：education，直接填写相应的汉字：初中，高中，中专，大专，本科，硕士，博士，博士后，其他
>* news/create bug修改，可以上传照片列表了，news/list 部落动态列表返回评论的昵称


11.24更新说明：
>* 增加我要上课/我要听课接口，接口为/accounts/mylessons，接口针对当前用户身份做出不同操作，
>* 对于学生是我要听课，后台查询所有该学生购买过的课程（这里指创建过订单的，但有可能支付未完成），返回这些课程的相关信息和支付情况
>* 对于老师是我要上课，后台查询所有对应user为该老师的课程，返回这些课程的相关信息

11.23更新说明：
>* 添加用户反馈内容接口/suggestion/create,用户反馈内容以一条suggestion记录的形式存储到数据库中
>* 添加app上我的视频对应后台接口/accounts/myvideo，返回当前登录用户自己录制上传的视频，供用户自己查看

11.22更新说明：
>* 数据库表格中user表添加字段description（个人简介）、school（对应学校）、subject（学科）、level（学段）、sex（性别）、style（授课风格）
>* 登陆成功接口/accounts/login返回增加description(用户简介)和nickname(用户名称)
>* 注册两个了账号 供测试使用（教师 18812345678 123456）（学生 17712345678 123456 ）
>* 添加个人信息获取接口/accounts/getinfo,个人信息修改接口/accounts/changeinfo


11.21更新说明：
>* 创建订单 /bill/create接口现增加返回创建账单bill的ID，用来当做发送给第三方支付平台的唯一订单号，方便支付结果反馈给服务器端时查询对应订单，更改本地支付业务逻辑
>* 本地完成第三方支付平台Beecloud的webhook回调函数，其中APP ID和APP Secret需要在Beecloud平台申请完成后，告诉后台，固定保存在服务器端

11.19更新说明：
>* 创建直播间 /lesson/createlive：教师需要指定价格(price)和直播间名称（description)等参数，返回直播间名称和教师密码
>* 在课程详情/lesson/details 里获取直播信息，如果用户有权限观看，会返回直播间ID、教师密码和学生密码，学生采用密码模式观看直播。为方便调试，密码都是 shishuo,即使未支付也可以测试直播和观看


11.16更新说明:
>* 修改了账单的接口，请按照新接口，通过bill/create 支付，bill/list 查询历史账单
>* 抽题不再同时创建题目，使用新接口 lesson/choose ，原 lesson/create 接口作废
>* 创建新的录播课程使用 lesson/uploadvideo ，需要把抽到的题目 questionID 发给后台（可以缺省）
>* 创建直播课程，使用 lesson/createlive，需要 把抽到的题目 questionID 发给后台（可以缺省），需要把cc房间号、老师直播的userID和password、学生看录播的userID和password传给后台，还需要上传直播的预计时间
>* 课程详情 lesson/details，如果paystate == 'paid' 或者 'free' 那么返回直播房间号和用户名密码等信息（在liveInfo中），否则 liveInfo为空
>* 课程列表 lesson/list 里面增加了课程类型（录播或者直播）

11.11更新说明：
>* 1. 部落动态和视频详情的评论部分接口添加返回字段
>* 2. 热门list的接口返回时增加缩略图的宽高thumbnailswidth、thumbnailsheight
>* 3. 数据库question表中增加thumbnails图片、preparationtime备课时间、answertime答题时间字段，抽题接口返回时增加以上新增问题相关字段

11.09更新说明：
>* 1. 数据库新建公告表announcement
>* 2. 后台添加发布课程公告/announcement/create、公告查询显示/announcement/list接口

11.08更新说明：
>* 1. 用户登录时返回添加了用户头像字段 
>* 2. 增加了用户修改头像接口/accounts/changeavatar 
>* 3. 数据库新建账单表bill
>* 4. 后台添加账单创建/bill/create、收入支出记录显示/bill/list接口

11.02更新说明：
>*  添加了/accounts/changepassword修改密码、/accounts/logout注销登录接口 


10.30 更新说明：
>* 1. 添加了 部落消息、支付接口 
>* 2. 课程、部落消息的 点赞和评论接口 
>* 3. 老师和学生通过注册区分，登陆我在后台返回用户类型 
>* 4. 直播和课程合并在一起，先通过 lesson/create 建立课程，然后客户端创建直播间，通过 lesson/startlive 把直播信息和课程绑定在一起，从而在教学视频列表中显示出直播
## 用户接口
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