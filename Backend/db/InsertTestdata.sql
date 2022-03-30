INSERT INTO Category (Title) VALUES ('Math');
INSERT INTO Category (Title) VALUES ('Logic'); 

INSERT INTO User (Username, Password, Bio, PicturePath, CountryID, Points, Deleted) VALUES ('User1', '123456', 'Nothing to see here', '', 1, 1000, 0);
INSERT INTO User (Username, Password, Bio, PicturePath, CountryID, Points, Deleted) VALUES ('User2', 'abcde', 'Great Bio', '../../Frontend/images/profile-1.png', 2, 2000, 0);
INSERT INTO User (Username, Password, Bio, PicturePath, CountryID, Points, Deleted) VALUES ('User3-del', '', '', '', null, 0, 1);

INSERT INTO Tag (PicturePath, Title) VALUES ('../../Frontend/images/icons/internet.png', 'Internet required');
INSERT INTO Tag (PicturePath, Title) VALUES ('../../Frontend/images/icons/knowledge.png', 'Special knowledge');
INSERT INTO Tag (PicturePath, Title) VALUES ('../../Frontend/images/icons/software.png', 'Special software');
INSERT INTO Tag (PicturePath, Title) VALUES ('../../Frontend/images/icons/location.png', 'Physical location');

INSERT INTO Hint (Description, Cost) VALUES ('Nothing', 0);
INSERT INTO Hint (Description, Cost) VALUES ('Something', 20);
INSERT INTO Hint (Description, Cost) VALUES ('Basicly the solution', 50);

INSERT INTO Difficulty (Level, Coins) VALUES (1, 10);
INSERT INTO Difficulty (Level, Coins) VALUES (2, 15);
INSERT INTO Difficulty (Level, Coins) VALUES (3, 20);
INSERT INTO Difficulty (Level, Coins) VALUES (9, 50);

INSERT INTO Country (CountryName) VALUES ('Tuvalu');
INSERT INTO Country (CountryName) VALUES ('Uganda');

INSERT INTO Challengecategory (ChallengeID, CategoryID) VALUES (1, 1);
INSERT INTO Challengecategory (ChallengeID, CategoryID) VALUES (2, 2);

INSERT INTO Challenge (ChallengeName, DifficultyID, Description, CreationDate, Solution) VALUES ('Challenge1', 1, 'This is some really long <b>text</b', '2021/03/27', 'passowrd');
INSERT INTO Challenge (ChallengeName, DifficultyID, Description, CreationDate, Solution) VALUES ('Challenge2', 2, 'Super interesting description', '2021/03/27', '');


INSERT INTO Challengetag (ChallengeID, TagID) VALUES (1, 1);
INSERT INTO Challengetag (ChallengeID, TagID) VALUES (1, 2);
INSERT INTO Challengetag (ChallengeID, TagID) VALUES (1, 3);
INSERT INTO Challengetag (ChallengeID, TagID) VALUES (2, 4);

INSERT INTO Challengefile (ChallengeID, FilePath) VALUES (1, '../Data/image.png');
INSERT INTO Challengefile (ChallengeID, FilePath) VALUES (2, '../Data/image.png');

