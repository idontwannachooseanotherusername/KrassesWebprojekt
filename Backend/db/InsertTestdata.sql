INSERT INTO Category (Title) VALUES ('Math');
INSERT INTO Category (Title) VALUES ('Logic'); 

INSERT INTO User (Username, Password, Bio, PicturePath, BannerPath, CountryID, Points, Deleted) VALUES ('User1', '123456', 'Nothing to see here', '', '', 1, 1000, 0);
INSERT INTO User (Username, Password, Bio, PicturePath, BannerPath, CountryID, Points, Deleted) VALUES ('User2', 'abcde', 'Great Bio', 'images/profile-1.png', 'images/profile-1.png', 2, 2000, 0);
INSERT INTO User (Username, Password, Bio, PicturePath, BannerPath, CountryID, Points, Deleted) VALUES ('User3-del', '', '', '', '', null, 0, 1);

INSERT INTO Tag (PicturePath, Title) VALUES ('images/icons/internet.png', 'Internet required');
INSERT INTO Tag (PicturePath, Title) VALUES ('images/icons/knowledge.png', 'Special knowledge');
INSERT INTO Tag (PicturePath, Title) VALUES ('images/icons/software.png', 'Special software');
INSERT INTO Tag (PicturePath, Title) VALUES ('images/icons/location.png', 'Physical location');

INSERT INTO Hint (Description, Class, Cost, ChallengeID) VALUES ('Nothing', 1, 0, 1);
INSERT INTO Hint (Description, Class, Cost, ChallengeID) VALUES ('Something', 2, 20, 1);
INSERT INTO Hint (Description, Class, Cost, ChallengeID) VALUES ('Basicly the solution', 3, 50, 2);

INSERT INTO Difficulty (Level, Points) VALUES (1, 10);
INSERT INTO Difficulty (Level, Points) VALUES (2, 15);
INSERT INTO Difficulty (Level, Points) VALUES (3, 20);
INSERT INTO Difficulty (Level, Points) VALUES (9, 50);

INSERT INTO Country (CountryName) VALUES ('Tuvalu');
INSERT INTO Country (CountryName) VALUES ('Uganda');

INSERT INTO Challengecategory (ChallengeID, CategoryID) VALUES (1, 1);
INSERT INTO Challengecategory (ChallengeID, CategoryID) VALUES (2, 2);

INSERT INTO Challenge (ChallengeName, DifficultyID, CategoryID, Description, CreationDate, Solution, UserID) VALUES ('Challenge1', 1, 1, 'This is some really long <b>text</b', '2021-03-27', 'password', 2);
INSERT INTO Challenge (ChallengeName, DifficultyID, CategoryID, Description, CreationDate, Solution, UserID) VALUES ('Challenge2', 2, 2, 'Super interesting description', '2021-03-27', '', 1);


INSERT INTO Challengetag (ChallengeID, TagID) VALUES (1, 1);
INSERT INTO Challengetag (ChallengeID, TagID) VALUES (1, 2);
INSERT INTO Challengetag (ChallengeID, TagID) VALUES (1, 3);
INSERT INTO Challengetag (ChallengeID, TagID) VALUES (2, 4);

INSERT INTO Challengefile (ChallengeID, FilePath) VALUES (1, '../Data/image.png');
INSERT INTO Challengefile (ChallengeID, FilePath) VALUES (2, '../Data/image.png');

INSERT INTO Solved (UserID, ChallengeID, TS) VALUES (1, 1, '2022-05-01');
INSERT INTO Solved (UserID, ChallengeID, TS) VALUES (1, 2, '2022-05-02');
INSERT INTO Solved (UserID, ChallengeID, TS) VALUES (2, 2, '2022-04-04');

INSERT INTO Userhints (UserID, HintID) VALUES (1, 1);
INSERT INTO Userhints (UserID, HintID) VALUES (1, 2);
INSERT INTO Userhints (UserID, HintID) VALUES (1, 3);
INSERT INTO Userhints (UserID, HintID) VALUES (2, 2);
