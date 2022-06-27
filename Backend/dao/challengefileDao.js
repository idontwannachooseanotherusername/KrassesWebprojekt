const helper = require('../helper.js');
const fs = require('fs');

class ChallengefileDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id){
        var sql = 'SELECT * FROM ChallengeFile WHERE FileID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return helper.objectKeysToLower(result);
    }

    loadByChallengeId(id) {
        var sql = 'SELECT * FROM ChallengeFile WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        return helper.arrayObjectKeysToLower(result);
    }

    loadAll() {;
        const challengeDao = new ChallengeDao(this._conn);
        var challenges = challengeDao.loadAll();

        const fileDao = new FileDao(this._conn);
        var files = fileDao.loadAll();

        var sql = 'SELECT * FROM ChallengeFile';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of challenges) {
                if (element.id == result[i].challengeid) {
                    result[i].challenge = element;
                    break;
                }
            }
            delete result[i].challengeid;
        }

        for (var i = 0; i < result.length; i++) {
            for (var element of files) {
                if (element.id == result[i].fileid) {
                    result[i].file = element;
                    break;
                }
            }
            delete result[i].fileid;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ChallengeFileID) AS cnt FROM Bestellposition WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(file, challengeid) {
        try{
            var path = helper.defaultData("challenge") + challengeid + "/";
            if (!fs.existsSync(path)) {fs.mkdirSync(path,{ recursive: true });}
            fs.writeFile(path + file.name, file.data, function (err) {
                if (err) {throw new Error('Could not create Record. Reason: ' + err);}
            });

            var sql = 'INSERT INTO Challengefile (ChallengeID, FilePath) VALUES (?,?)';
            var statement = this._conn.prepare(sql);
            var params = [challengeid, file.name];
            var result = statement.run(params);

            if (result.changes != 1) 
                throw new Error('Could not insert new Record. Data: ' + challengeid);
        }
        catch (ex) {
            throw new Error('Could not create Record. Reason: ' + challengeid);
        }
    }

    delete(id) {
        try {
            var file = this.loadById(id);
            fs.unlinkSync(helper.defaultData("challenge") + file.challengeid + "/" + file.filepath);

            var sql = 'DELETE FROM ChallengeFile WHERE FileID=?';
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
        helper.log('ChallengeFileDao [_conn=' + this._conn + ']');
    }
}

module.exports = ChallengefileDao;
