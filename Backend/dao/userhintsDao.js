const helper = require('../helper.js');
// const ChallengeDao = require('./challengeDao.js');

class UserhintsDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadAllByUserId(userid){
        var sql = 'SELECT * FROM Userhints WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(userid);

        if (helper.isUndefined(result))
            throw new Error('Userhints are undefined from userid=' + userid);
        result = helper.arrayObjectKeysToLower(result);

        var userhints = [];
        for(var i=0; i< result.length; i++){
            if (result[i].userid == userid) {userhints.push(result[i].hintid);}
        }
        return userhints;
    }

    create(userid, hintid) {
        var userhints = this.loadAllByUserId(userid);
        if (userhints.includes(hintid))  // Already in db
            return;

        var sql = 'INSERT INTO Userhints (UserID, HintID) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [userid, hintid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);
    }

    toString() {
        helper.log('UserhintsDao [_conn=' + this._conn + ']');
    }
}

module.exports = UserhintsDao;
