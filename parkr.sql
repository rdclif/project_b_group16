CREATE TABLE user ( 
user_id VARCHAR(50) NOT NULL,
first_name VARCHAR(25) NOT NULL, 
last_name VARCHAR(25) NOT NULL, 
PRIMARY KEY (user_id)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE parking ( 
parking_id INT NOT NULL AUTO_INCREMENT,
location VARCHAR(25) NOT NULL, 
availability BOOLEAN NOT NULL DEFAULT 0, 
price DECIMAL(5,2) NOT NULL, 
photo VARCHAR(255),
fk_owner_id VARCHAR(50) NOT NULL,
PRIMARY KEY (parking_id),
CONSTRAINT FOREIGN KEY(fk_owner_id) REFERENCES user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE owner ( 
id INT NOT NULL AUTO_INCREMENT,
user_id VARCHAR(50) NOT NULL,
payment_email VARCHAR(255) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY(user_id) REFERENCES user(user_id)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE car ( 
id INT NOT NULL AUTO_INCREMENT,
user_id VARCHAR(50) NOT NULL,
make VARCHAR(50) NOT NULL,
model VARCHAR(50) NOT NULL,
year SMALLINT NOT NULL,
license_plate VARCHAR(25) NOT NULL,
photo VARCHAR(255), 
PRIMARY KEY (id),
FOREIGN KEY(user_id) REFERENCES user(user_id)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE renter (
id INT NOT NULL AUTO_INCREMENT,
user_id VARCHAR(50) NOT NULL,
car_id INT NOT NULL,
payment_email VARCHAR(255) NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY(user_id) REFERENCES user(user_id),
FOREIGN KEY(car_id) REFERENCES car(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;