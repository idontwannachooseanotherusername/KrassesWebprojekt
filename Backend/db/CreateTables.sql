-- Category definition

CREATE TABLE "Category" (
	CategoryID INTEGER NOT NULL PRIMARY KEY,
	Title TEXT NOT NULL
);

-- challenge definition

CREATE TABLE "Challenge" (
	ChallengeID INTEGER NOT NULL,
	ChallengeName TEXT NOT NULL,
	DifficultyID INTEGER DEFAULT 1 NOT NULL,
	CategoryID INTEGER NOT NULL,
	Description TEXT,
	CreationDate TEXT NOT NULL,
	Solution TEXT NOT NULL,
	UserID INTEGER NOT NULL,
	CONSTRAINT challenge_PK PRIMARY KEY (ChallengeID),
	CONSTRAINT challenge_FK FOREIGN KEY (DifficultyID) REFERENCES Difficulty(DifficultyID),
	CONSTRAINT challenge_FK2 FOREIGN KEY (UserID) REFERENCES User(UserID),
	CONSTRAINT challenge_FK3 FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- challengecategory definition

CREATE TABLE "Challengecategory" (
	ChallengeID INTEGER NOT NULL,
	CategoryID INTEGER NOT NULL,
	CONSTRAINT challengecategory_FK FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID),
	CONSTRAINT challengecategory_FK2 FOREIGN KEY (CategoryID) REFERENCES Challenge(ChallengeID)
);

-- challengepicture definition

CREATE TABLE "Challengefile" (
	FileID INTEGER NOT NULL,
	ChallengeID INTEGER NOT NULL,
	FilePath TEXT NOT NULL,
	CONSTRAINT challengefile_FK PRIMARY KEY (FileID),
	CONSTRAINT challengefile_FK2 FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID)
);

-- challengetag definition

CREATE TABLE "Challengetag" (
	ChallengeID INTEGER NOT NULL,
	TagID INTEGER NOT NULL,
	CONSTRAINT challengetag_FK FOREIGN KEY (TagID) REFERENCES Tag(TagID),
	CONSTRAINT challengetag_FK2 FOREIGN KEY (challengeID) REFERENCES challenge(ChallengeID)
);

-- Country definition

CREATE TABLE "Country" (
	"CountryID"	INTEGER NOT NULL,
	"CountryName"	TEXT NOT NULL,
	PRIMARY KEY("CountryID")
);

-- Difficulty definition

CREATE TABLE "Difficulty" (
	DifficultyID INTEGER NOT NULL,
	Level INTEGER NOT NULL DEFAULT 1,
	Points INTEGER NOT NULL,
	PRIMARY KEY("DifficultyID")
);

-- Hint definition

CREATE TABLE "Hint" (
	"HintID"	INTEGER NOT NULL,
	"Description"	TEXT NOT NULL,
	"Class" INTEGER NOT NULL,
	"Cost"	INTEGER NOT NULL,
	"ChallengeID"  INTEGER NOT NULL,
	PRIMARY KEY("HintID"),
	CONSTRAINT hint_FK FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID)
);

-- Tag definition 

CREATE TABLE "Tag" (
	"TagID"	INTEGER NOT NULL,
	"PicturePath"	TEXT NOT NULL,
	"Title"	TEXT NOT NULL,
	PRIMARY KEY("TagID")
);

-- "User" definition

CREATE TABLE "User" (
	"UserID"	INTEGER NOT NULL,
	"Username"	TEXT NOT NULL,
	"Password"	TEXT NOT NULL,
	"Bio"	TEXT,
	"BannerPath"    TEXT,
	"PicturePath"	TEXT,
	"CountryID"	INTEGER,
	"Points"	INTEGER NOT NULL DEFAULT 0,
	"Deleted"   INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("UserID")
);

-- Solved definition 

CREATE TABLE "Solved" (
	"SolvedID"	INTEGER NOT NULL,
	"UserID"	INTEGER NOT NULL,
	"ChallengeID"	INTEGER NOT NULL,
	"TS"	TEXT NOT NULL,
	PRIMARY KEY("SolvedID"),
	CONSTRAINT solved_FK FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID)
);

-- Userhints definition

CREATE TABLE "Userhints" (
    "UserID" INTEGER NOT NULL,
    "HintID" INTEGER NOT NULL,
    CONSTRAINT userhints_FK FOREIGN KEY (UserID) REFERENCES User(UserID),
    CONSTRAINT userhints_FK2 FOREIGN KEY (HintID) REFERENCES Hint(HintID)
);
