const helper = require('../helper.js');
// const ChallengeDao = require('./challengeDao.js');

class HintDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Hint WHERE HintID=?';
        // TODO: "Cannot read property 'prepare' of undefined" ???
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);
        delete result.challengeid;

        return result;
    }

    loadByChallengeId(classid, challengeid){
        var result = this.loadAllByChallengeId(challengeid);
        for (var hint of result){
            if (hint.Class == classid){
                return helper.objectKeysToLower(hint);
            }
        }
        
        throw new Error('No Record found by id=' + id);
    }

    loadAllByChallengeId(challengeid){
        var sql = 'SELECT * FROM Hint WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(challengeid);

        if (helper.isUndefined(result))
            throw new Error('Hints are undefined from challengeid=' + challengeid);
        result = helper.arrayObjectKeysToLower(result);

        for(var i=0; i< result.length; i++){
            delete result[i].challengeid;
        }
        return result;
    }

    check(challengeid) {
        var sql = 'SELECT * FROM Hint WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(challengeid);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + classid);

        result = helper.objectKeysToLower(result);
        // TODO: Set that hint was used

        return result;
    }

    create(challengeid, hintclass, description = '', cost) {
        if (helper.isUndefined(cost)){
            switch(hintclass){
                case 1: cost = 0; break;
                case 2: cost = 20; break;
                case 3: cost = 50; break;
            }
        }

        var sql = 'INSERT INTO Hint (Description, Class, Cost, ChallengeID) VALUES (?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [description, hintclass, cost, challengeid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(challengeid, hintclass, description = '') {
        var sql = 'UPDATE Hint SET Description=? WHERE ChallengeID=? AND Class=?';
        var statement = this._conn.prepare(sql);
        var params = [description, challengeid, hintclass];
        var result = statement.run(params);

        if (result.changes != 1){
            throw new Error('Could not update existing Record. Data: ' + params);
            //return this.create(challengeid, hintclass, description);
        }
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM Hint WHERE HintID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        helper.log('HintDao [_conn=' + this._conn + ']');
    }
}

module.exports = HintDao;
