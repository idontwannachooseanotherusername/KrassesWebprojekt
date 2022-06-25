const md5 = require('md5');
const helper = require('../helper.js');
const CountryDao = require('./countryDao.js');
const ChallengeDao = require('./challengeDao.js');
const webtoken = require('../webtoken/index.js');
const fs = require('fs');

class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id, password = false) {
        const countryDao = new CountryDao(this._conn);
        const challengeDao = new ChallengeDao(this._conn);

        var sql = 'SELECT * FROM User WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        // Country and bio
        if (!helper.isEmpty(result.countryid)){
            result.country = countryDao.loadById(result.countryid).countryname;
        }
        else{
            result.country = helper.defaultData("country");
        }

        if (helper.isEmpty(result.bio)){
            result.bio = helper.defaultData("bio");
        }

        // Get last 10 solved challenges
        var sql = 'SELECT * FROM Solved order by SolvedID desc limit 10';
        var statement = this._conn.prepare(sql);
        var result_solved = statement.all();
        var dt = helper.parseSQLDateTimeString(result_solved.ts);
        result_solved.ts = helper.formatToGermanDateTime(dt)

        if (helper.isArrayEmpty(result_solved)) 
            return [];

        result_solved = helper.arrayObjectKeysToLower(result_solved);
        
        var solved_list = [];
        for (var solved of result_solved){
            if (solved.userid == result.userid){
                delete solved.userid;
                solved.challengename = challengeDao.loadById(solved.challengeid).challengename;
                solved_list.push(solved);

                if (solved_list.length >= 10){break;}
            }
        }
        result.solved = solved_list;

        // Get last 10 created challenges
        var created_list = [];
        for (var e of challengeDao.loadAll()){
            if (e.user.userid == result.userid){
                created_list.push({
                    challengeid: e.challengeid,
                    challengename: e.challengename,
                    ts: e.creationdate
                });

                if (created_list.length >= 10){break;}
            }
        }
        result.created = created_list;

        // Strip user password
        if (!password) {delete result.password;}

        // Add default images
        if (helper.isEmpty(result.bannerpath)){
            if (result.deleted){
                result.bannerpath = helper.defaultData("banner_d");
            }else{
                result.bannerpath = helper.defaultData("banner");
            }
        }
        if (helper.isEmpty(result.picturepath)) {
            if (result.deleted){
                result.picturepath = helper.defaultData("profile_d");
            }else{
                result.picturepath = helper.defaultData("profile");
            }
        }

        return result;
    }

    loadAll() {
        const countryDao = new CountryDao(this._conn);
        var countries = countryDao.loadAll();

        var sql = 'SELECT * FROM User';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {          
            // Countries can be empty(null)
            if (result[i].countryid != null){
                for (var element of countries) {
                    if (element.countryid == result[i].countryid.countryname) {
                        result[i].country = element;
                        break;
                    }
                }
                delete result[i].countryid;
            }
            // Strip user password
            delete result[i].password;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(UserID) AS cnt FROM User WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    username_exists(username=''){
        var sql = 'SELECT * FROM User WHERE Username=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(username);

        if (result == undefined || result.Deleted == 1){return false};
        return helper.arrayObjectKeysToLower(result);
    }

    create(username = '', password = '', bio = '', picturepath = '', bannerpath = '', countryid = null, points = 0, deleted = 0) {
        const countryDao = new CountryDao(this._conn);

        // Login user if username exists and pw matches
        var user = this.username_exists(username);
        if (user !== false){
            if (md5(password) === user.Password){
                return webtoken.generate(username, user.UserID);
            }
            else{
                throw new Error('Password does not match for username: ' + username);
            }
        }
        
        var sql = 'INSERT INTO User (Username, Password, Bio, PicturePath, BannerPath, CountryID, Points, Deleted) VALUES (?,?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [username, md5(password), bio, picturepath, bannerpath, countryid, points, deleted];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return webtoken.generate(username, newObj.userid);
    }

    save_file(path, file, namedtype,id){
        try {
            if (!fs.existsSync(path)) {fs.mkdirSync(path,{ recursive: true });}
        } catch (err) {
            console.error(err);
        }

        fs.writeFile(path + namedtype, file.data, function (err) {
            if (err) {return console.log(err);}
        });
        
        if(namedtype == 'profile-picture.jpg'){
            var sql = 'UPDATE User SET PicturePath=? WHERE UserID=?';
            var params = [namedtype,id];
            var statement = this._conn.prepare(sql);           
            var result = statement.run(params);

            if (result.changes != 1)
                throw new Error('Could not update existing Record with given data: ' + params);
            
        }
        else{
            var sql = 'UPDATE User SET BannerPath=? WHERE UserID=?';
            var params = [namedtype,id];
            var statement = this._conn.prepare(sql);
            var result = statement.run(params);
    
            if (result.changes != 1)
                throw new Error('Could not update existing Record with given data: ' + params);
            
        }   
    }

    update_data(id, username = '', bio = '', picturepath = '', bannerpath = '', countryid = '') {
        var old_data = this.loadById(id);
        if (username != old_data.username && this.username_exists(username)){
            throw new Error('Could not update profile: Username ' + username + ' already exists.');
        }

        if (helper.isEmpty(username)){username = old_data.username;}
        if (helper.isEmpty(bio)){bio = old_data.bio;}
        if (helper.isEmpty(picturepath)){picturepath = old_data.picturepath;}
        if (helper.isEmpty(bannerpath)){bannerpath = old_data.bannerpath;}
        if (helper.isEmpty(countryid)){countryid = old_data.countryid;}

        var sql = 'UPDATE User SET Username=?,Bio=?,PicturePath=?,BannerPath=?,CountryID=? WHERE UserID=?';
        var params = [username, bio, picturepath, bannerpath, countryid, id];
        var statement = this._conn.prepare(sql);
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record with given data: ' + params);
    }

    update_points(userid, points){
        var sql = 'UPDATE User SET Points=? WHERE UserID=?';
        var params = [points, userid];
        var statement = this._conn.prepare(sql);
        var result = statement.run(params);
        if (result.changes != 1)
            throw new Error('Could not update userpoints with given data: ' + params);
    }

    update_password(id, newpassword, oldpassword){
        var sql = 'UPDATE User SET Password=? WHERE UserID=?';
        if (this.loadById(id, true).password == md5(oldpassword)){  // Check if old password matches
            var params = [ md5(newpassword), id];
        }
        else{
            throw new Error('Old passwords do not match - userid: ' + id);
        }

        var statement = this._conn.prepare(sql);
        var result = statement.run(params);
        if (result.changes != 1)
            throw new Error('Could not update existing Record with given data: ' + params);
    }

    delete(id) {
        var sql = 'UPDATE User SET Username=?,Bio=?,PicturePath=?,BannerPath=?,CountryID=?, Password=?, Deleted=? WHERE UserID=?';
        var params = ["Deleted User", "deleted", "", "", null, "", 1, id];
        var statement = this._conn.prepare(sql);
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not delete user with given data: ' + params);
    }

    toString() {
        helper.log('UserDao [_conn=' + this._conn + ']');
    }
}

module.exports = UserDao;
