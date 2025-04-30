CREATE TABLE personne (
	idp SERIAL PRIMARY KEY, 
	nom VARCHAR(50) NOT NULL, 
	prenom VARCHAR(50)  NOT NULL
	);
	
CREATE TABLE competence (
	idc SERIAL PRIMARY KEY,
	nom VARCHAR(50) UNIQUE NOT NULL,
	);
	
CREATE TABLE personne_competence (
	idp VARCHAR(50) NOT NULL,
	idc VARCHAR(50) NOT NULL,
	PRIMARY KEY (idp, idc),
	FOREIGN KEY (idp) REFERENCES personne (idp),
	FOREIGN KEY (idc) REFERENCES competence (idc)
	);