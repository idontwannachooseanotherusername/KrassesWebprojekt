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
	PRIMARY KEY (ChallengeID),
	FOREIGN KEY (DifficultyID) REFERENCES Difficulty(DifficultyID),
	FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
	FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- challengecategory definition

CREATE TABLE "Challengecategory" (
	ChallengeID INTEGER NOT NULL,
	CategoryID INTEGER NOT NULL,
	FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID) ON DELETE CASCADE,
	FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- challengepicture definition

CREATE TABLE "Challengefile" (
	FileID INTEGER NOT NULL,
	ChallengeID INTEGER NOT NULL,
	FilePath TEXT NOT NULL,
	PRIMARY KEY (FileID),
	FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID) ON DELETE CASCADE
);

-- challengetag definition

CREATE TABLE "Challengetag" (
	ChallengeID INTEGER NOT NULL,
	TagID INTEGER NOT NULL,
	FOREIGN KEY (TagID) REFERENCES Tag(TagID) ON DELETE CASCADE,
	FOREIGN KEY (ChallengeID) REFERENCES challenge(ChallengeID) ON DELETE CASCADE
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
	FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID) ON DELETE CASCADE
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
	FOREIGN KEY (CountryID) REFERENCES Country(CountryID)
);

-- Solved definition 

CREATE TABLE "Solved" (
	"SolvedID"	INTEGER NOT NULL,
	"UserID"	INTEGER NOT NULL,
	"ChallengeID"	INTEGER NOT NULL,
	"TS"	TEXT NOT NULL,
	PRIMARY KEY("SolvedID"),
	FOREIGN KEY (ChallengeID) REFERENCES Challenge(ChallengeID) ON DELETE CASCADE,
	FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

-- Userhints definition

CREATE TABLE "Userhints" (
    "UserID" INTEGER NOT NULL,
    "HintID" INTEGER NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (HintID) REFERENCES Hint(HintID) ON DELETE CASCADE
);
