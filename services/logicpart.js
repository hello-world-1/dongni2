/**
 * Created by root on 7/31/17.
 */

const IWAP00 = async (params) => {
    try {
        if(params.length!=4) {
            return Promise.reject('error');
        }
        //await cha mongodb  1390001|1380002,1370001|1360002
        //const Account = await mongodb.findOne()
        const phone="1390001|1380002";
        const sos="1370001|1360002";
        const time=(new Date()).toFormat("YYYY-MM-DD HH:MI:SS")
        const rep="IWBP00,"+time+",8,zh_CN, Asia/chongqing,"+phone+","+sos+"#";
        return Promise.resolve(rep);
        //return rep;
    } catch(err) {
        return Promise.reject('error');
    }
};

exports.IWAP00=IWAP00;