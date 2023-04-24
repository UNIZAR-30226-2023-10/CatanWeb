

const Storage  = {

    getUserInfo(username){
        return JSON.parse(localStorage.getItem(username))
    },

    getUserField(username, field) {
        let user = localStorage.getItem(username)
        if (user  == null){
            return ''
        }
        else {
            return JSON.parse(user)[field]
        }
    },

    setUserField(username, field, data){

       let info = localStorage.getItem(username)
       if (info  == null){
            info  = {}
       }
       else {
            info = JSON.parse(info)
       }
       info[field]= data
       localStorage.setItem(JSON.stringify(username,info))
       return
    },

    setUserInfo(username, data){
        localStorage.setItem(username,JSON.stringify(data))
        return
    },

}

module.exports = Storage


