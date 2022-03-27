-- Category definition

CREATE TABLE "Category" (
	CategoryID INTEGER NOT NULL PRIMARY KEY,
	Title TEXT NOT NULL
);

-- challenge definition

CREATE TABLE Challenge (
	challengeID INTEGER NOT NULL,
	challengeName TEXT NOT NULL,
	DifficultyID INTEGER DEFAULT 1 NOT NULL,
	Description TEXT,
	CreationDate TEXT NOT NULL,
	Solution TEXT NOT NULL,
	CONSTRAINT challenge_PK PRIMARY KEY (ChallengeID),
	CONSTRAINT challenge_FK FOREIGN KEY (DifficultyID) REFERENCES Difficulty(DifficultyID)
);

-- challengecategory definition

CREATE TABLE Challengecategory (
	challengeID INTEGER NOT NULL,
	CategoryID INTEGER NOT NULL,
	CONSTRAINT challengecategory_FK FOREIGN KEY (challengeID) REFERENCES challenge(ChallengeID),
	CONSTRAINT challengecategory_FK_1 FOREIGN KEY (CategoryID) REFERENCES challenge(ChallengeID)
);

-- challengepicture definition

CREATE TABLE Challengepicture (
	PictureID INTEGER NOT NULL,
	challengeID INTEGER NOT NULL,
	PicturePath TEXT NOT NULL,
	CONSTRAINT challengePICTURE_PK PRIMARY KEY (PictureID),
	CONSTRAINT challengepicture_FK FOREIGN KEY (challengeID) REFERENCES challenge(ChallengeID)
);

-- challengetag definition

CREATE TABLE Challengetag (
	challengeID INTEGER NOT NULL,
	TagID INTEGER NOT NULL,
	CONSTRAINT fk_challengetag2 FOREIGN KEY (TagID) REFERENCES Tag(TagID),
	CONSTRAINT challengetag_FK FOREIGN KEY (challengeID) REFERENCES challenge(ChallengeID)
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
	Coins INTEGER NOT NULL,
	PRIMARY KEY("DifficultyID")
);

-- Hint definition

CREATE TABLE "Hint" (
	"HintID"	INTEGER NOT NULL,
	"Description"	TEXT NOT NULL,
	"Cost"	INTEGER NOT NULL,
	PRIMARY KEY("HintID")
);

-- Tag definition

CREATE TABLE "Tag" (
	"TagID"	INTEGER,
	"PicturePath"	TEXT,
	"Title"	TEXT,
	PRIMARY KEY("TagID")
);

-- "User" definition

CREATE TABLE "User" (
	"UserID"	INTEGER NOT NULL,
	"Username"	TEXT NOT NULL,
	"Password"	TEXT NOT NULL,
	"Bio"	TEXT,
	"PicturePath"	TEXT,
	"CountryID"	INTEGER,
	"Points"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("UserID" AUTOINCREMENT)
);
