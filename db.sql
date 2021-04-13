CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    register_date TIMESTAMP,
    role VARCHAR(5),
    liked_posts INTEGER[],
    followers INTEGER[],
    followed_users INTEGER[],
    drafts integer[],
    writings integer[],
    profile_image text,
    biography varchar(100),
    external_account bool,
    blocked_accounts integer[],
    valid bool,
    likes_notif_active bool,
    comments_notif_active bool,
    follows_notif_active bool,
    tags_notif_active bool,
    favourites integer[]
);

CREATE TABLE writings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    body TEXT,
    writer_id INTEGER,
    last_edited TIMESTAMP,
    genre VARCHAR(10),
    tags VARCHAR[],
    comments INTEGER[],
    likes INTEGER[],
    subgenre varchar(30),
    completed bool,
    cover text,
    description text,
    viewers integer[],
    anon_viewers integer[],
    chapters integer[],
    foreign key(writer_id) references users(id)
);

CREATE TABLE drafts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    body TEXT,
    writer_id INTEGER,
    last_edited TIMESTAMP,
    genre VARCHAR(10),
    subgenre varchar(30),
    tags VARCHAR[],
    comments INTEGER[],
    likes INTEGER[],
    description varchar(400),
    completed bool,
    cover text,
    chapters integer[],
    foreign key(writer_id) references users(id)
);

CREATE TABLE commentItem (
    id SERIAL PRIMARY KEY,
    commenter_id INTEGER NOT NULL,
    writing_id INTEGER NOT NULL,
    content TEXT,
    likes INTEGER[],
    responses INTEGER[],
    in_response_to integer,
    is_comment bool,
    FOREIGN KEY(commenter_id) REFERENCES users,
    FOREIGN KEY(writing_id) REFERENCES writings
);

create table chapters (
    id serial primary key,
    body text,
    writing_id int not null,
    foreign key(writing_id) references writings(id)
);

create table draft_chapters (
    id serial primary key,
    body text,
    draft_id int not null,
    foreign key(draft_id) references drafts(id)
);

create table notifications(
  id serial primary key,
  created_at timestamp,
  user_id integer not null,
  type varchar(10),
  read bool,
  sender_id integer not null,
  post_id integer,
  foreign key(user_id) references users(id),
  foreign key(sender_id) references users(id),
  foreign key(post_id) references writings(id)
);

create table password_recoveries (
    id serial primary key,
    token text not null,
    email varchar(100) not null
);

create table validation_tokens (
  id serial primary key,
  token text,
  username varchar(30),
  password text,
  expiration_date date
);
