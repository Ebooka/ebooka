INSERT INTO writings(title, body, writer_id, last_edited, genre, tags, comments, likes)
values ('hola', 'soy un capo', 1, now(), 'Poesia', null, null, array['123', '123']);

alter table users add constraint unique_const_email unique (email)

select * from writings as w order by array_length(w.likes, 1) desc nulls last
select * from writings order by last_edited desc
SELECT * FROM writings WHERE genre = 'Poesia' ORDER BY last_edited DESC;
select likes from writings
sELECT * FROM writings WHERE genre = 'Poesia' OR genre = 'Biografia' ORDER BY array_length(likes, 1) DESC NULLS LAST;
select * from writings where id = 1;
SELECT * FROM writings WHERE genre = 'Biografia' ORDER BY array_length(likes, 1) DESC NULLS LAST;
alter table writings add foreign key (writer_id) references users(id);
alter table writings alter column last_edited set default now();
update writings set last_edited = now()
SELECT * FROM writings WHERE genre = 'Biografia' ORDER BY array_length(likes, 1) DESC NULLS LAST;
update writings set likes = array_append(likes, 25) where id = 8 returning *;
update users set liked_posts = array_append(liked_posts, 25)
update users set liked_posts = array_remove(liked_posts, 7) where id = 3 returning * 
update writings set likes = array_remove(likes, null) from writings join users as u on writer_id = u.id where id = 7 returning *;
alter table users add column drafts integer[]
select * from writings
drop table likeItem
delete from writings where id >= 9
insert into likeItem(liker_id, writing_id) values(3,8) returning id;
DELETE FROM likeItem WHERE liker_id = 4 AND writing_id = 8 RETURNING id;
update users set password = '$2a$10$e01s6UTicCuu.I11P/Hyc.sfxu5S2gm2ngtqPoMb7l7JWCSHSO06S' where id = 1
SELECT username, email, liked_posts, followers, followed_users, role FROM users WHERE id = 1;
alter table writings add column likes int[]

CREATE TABLE likeItem (
    id SERIAL PRIMARY KEY,
    liker_id INTEGER NOT NULL,
    writing_id INTEGER NOT NULL,
    FOREIGN KEY(liker_id) REFERENCES users,
    FOREIGN KEY(writing_id) REFERENCES writings
);

CREATE TABLE commentItem (
    id SERIAL PRIMARY KEY,
    commenter_id INTEGER NOT NULL,
    writing_id INTEGER NOT NULL,
    content TEXT,
    likes INTEGER[],
    responses INTEGER[],
    FOREIGN KEY(commenter_id) REFERENCES users,
    FOREIGN KEY(writing_id) REFERENCES writings
);

CREATE TABLE comment_responses (
        id serial primary key,
        commenter_id integer not null,
        parent_comment_id integer not null,
        parent_response_id integer,
        content text,
        likes integer[],
        responses integer[],
        foreign key(commenter_id) references users(id),
        foreign key(parent_comment_id) references commentItem(id),
        foreign key(parent_response_id) references comment_responses(id)
)

select distinct w.*, u.username, l.liker_id from writings as w join users as u on w.writer_id = u.id left join likeItem as l on l.writing_id = w.id
select w.likes, l.* from writings as w join likeItem as l on w.id = l.writing_id
select w.*, u.username from writings as w join users as u on w.writer_id = u.id and w.id = 7
SELECT title, genre, body, likes, comments FROM writings WHERE id = 14

CREATE TABLE drafts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    body TEXT,
    writer_id INTEGER,
    last_edited TIMESTAMP,
    genre VARCHAR(10),
    tags VARCHAR[],
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    message TEXT,
    created_at TIMESTAMP DEFAULT now(),
    user_id INTEGER,
    type VARCHAR(10),  
    read BOOLEAN DEFAULT false,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

alter table drafts drop column comments
update drafts set last_edited = now() where id = 1 returning *;
select writings from users where username = 'eugedamm'
select * from users where id > 10
select writer_id from writings where id > 22
select * from users where id = 20
delete from writings where writer_id = 19 
delete from commentItem where id = 1 or id = 2
select username, content from commentItem as c join users as u on u.id = commenter_id where c.id = (select unnest(comments) from writings as w where w.id = 23 order by unnest desc limit 1) 

UPDATE users SET liked_posts = array_remove(liked_posts, 36) WHERE username = 'eugedamm' RETURNING *;
UPDATE users SET blocked_accounts = array_remove(blocked_accounts, 34) WHERE id = 91 RETURNING blocked_accounts

select * from users where id in (select unnest(followed_users) from users where id = 3)
SELECT w.title, w.likes, w.comments, u.username FROM writings AS w JOIN users AS u ON w.writer_id = u.id WHERE w.id IN (SELECT unnest(liked_posts) FROM users WHERE id = 3)
update users set profile_image = null where id = 3
alter table users alter column profile_image type text
alter table users add column profile_image text
delete from users where id >= 21
update users set profile_image = '/assets/user.png' where id = 34
alter table notifications add column post_id integer
alter table notifications add constraint fk_reference_post foreign key (post_id) references writings(id)
select * from notifications where user_id = 3 and sender_id != 3
insert into notifications(message, user_id, type, sender_id, post_id) values (' empezó a seguirte', 3, 'FOLLOW', 7, null)
alter table notifications drop column message
insert into notifications(user_id, type, sender_id, post_id) values (' likeo tu escrito', 3, 'LIKE', 7, 18)
SELECT type, created_at, u.username, u.profile_image, post_id, me.followers FROM notifications JOIN users as u ON sender_id = u.id JOIN users AS me ON user_id = me.id WHERE user_id = 3 AND read = FALSE;
INSERT INTO notifications(user_id, type, sender_id, post_id) values (3, 'LIKE', 7, 17);
INSERT INTO notifications(user_id, type, sender_id, post_id) values ((select unnest(followers) from users where id = 3), 'LIKE', 3, 17);
SELECT type, created_at, u.username, u.id, u.profile_image, post_id, me.followed_users FROM notifications JOIN users AS u ON sender_id = u.id JOIN users AS me ON me.id = user_id WHERE user_id = 3 AND read = FALSE AND sender_id != 3 ORDER BY created_at DESC;
delete from users where email = 'edamm@itba.edu.ar'
select followed_users from users where id = 3
delete from users where id = 20 
alter table notifications add foreign key(sender_id) references users(id) on delete cascade
alter table commentItem add foreign key(commenter_id) references users(id) on delete cascade
alter table notifications drop constraint fk_reference 
alter table drafts add column subgenre varchar(30)
delete from users where id = 91
delete from notifications where sender_id = 3
delete from drafts
SELECT w.*, u.username, u.profile_image FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.subgenre = 'Terror'
alter table drafts alter column genre type varchar(50)
alter table users add column blocked_accounts integer[]
update drafts set completed = 'true' where id = 19
alter table users add column external_account boolean default false
update users set external_account = false where id = 52
select blocked_accounts from users where id = 91
SELECT u.username, u.profile_image FROM users as u WHERE u.id IN (select unnest(blocked_accounts) from users where id = 91)
SELECT w.*, u.username, u.profile_image FROM writings as w JOIN users as u ON w.writer_id = u.id AND w.writer_id NOT IN (SELECT UNNEST(blocked_accounts) FROM users WHERE id = 91) ORDER BY last_edited DESC;
INSERT INTO notifications(user_id, type, sender_id, post_id) values ($1, 'WRITING', $2, $3)

alter table writings add column chapters integer[]
select id, title, description from writings order by id desc
SELECT read, type, created_at, u.username, u.id, u.profile_image, post_id, me.followed_users FROM notifications JOIN users AS u ON sender_id = u.id JOIN users AS me ON me.id = user_id WHERE user_id =  AND sender_id != $1 ORDER BY created_at DESC;

create table chapters (
        id serial primary key,
        body text,
        writing_id integer not null,
        foreign key(writing_id) references writings(id) on delete cascade
);

SELECT id, chapters from writings
alter table drafts add column 
SELECT w.*, u.username, u.profile_image, u.id AS writer_id FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.id = 55;
select body from chapters where id in (SELECT unnest(chapters) from writings where id = 55)
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION pg_trgm;
SELECT w.id, title, genre, likes, viewers, anon_viewers FROM writings AS w JOIN users AS u ON w.writer_id = u.id WHERE soundex(title) = soundex('euge') OR soundex(genre) = soundex('euge');
select username, similarity(metaphone(username, 10), metaphone('euge', 10)) from users where similarity(metaphone(username, 10), metaphone('euge', 10)) > 0.25
SELECT greatest(similarity(metaphone(genre, 10), metaphone('test', 10)), similarity(metaphone(title, 10), metaphone('test', 10))), title FROM writings AS w JOIN users AS u ON w.writer_id = u.id WHERE similarity(metaphone(title, 10), metaphone('test', 10)) > 0.1 OR similarity(metaphone(genre, 10), metaphone('test', 10)) > 0.1 order by greatest(similarity(metaphone(genre, 10), metaphone('test', 10)), similarity(metaphone(title, 10), metaphone('test', 10))) desc limit 3;
update users set valid = true where username = 'eugeniodamm'
create table draft_chapters (
        id serial primary key,
        body text,
        draft_id integer not null,
        foreign key(draft_id) references drafts(id) on delete cascade
);

select unnest(chapters) from drafts where id = 28;
update drafts set body = '<p>Re que si</p>' where id = 32;

SELECT w.*, u.username, u.profile_image, u.id AS writer_id FROM writings AS w JOIN users as u ON w.writer_id = u.id AND w.id = 58;
select followers from users where id = 95

create table password_recoveries (
        id serial primary key,
        token text,
        email varchar(100)
);
drop table password_recoveries
delete from password_recoveries
alter table users add column tags_notif_active boolean default true;


select likes_notif_active, comments_notif_active, tags_notif_active, follows_notif_active from users where id = 95;

select u.id, notifs.case 
        from notifications as n join users as u on u.id = n.user_id join notifs on notifs.id = u.id where user_id = 95 and notifs.case is not null;


create view '95' as (select n.id, case
                        when type = 'LIKE' and u.likes_notif_active = 'true' then 'active'
                        when type = 'COMMENT' and u.comments_notif_active = 'true' then 'active'
                        when type = 'TAG' and u.tags_notif_active = 'true' then 'active'
                        when type = 'FOLLOW' and u.follows_notif_active = 'true' then 'active'
                end from notifications as n join users as u on u.id = n.user_id where n.user_id = 95 and n.sender_id != 95)
drop view notifs
select * from notifs

SELECT read, type, created_at, u.username, u.id, u.profile_image, post_id, me.followed_users FROM notifications JOIN users AS u ON sender_id = u.id JOIN users AS me ON me.id = user_id WHERE user_id = 95 AND sender_id != 95 ORDER BY created_at DESC

SELECT read, type, created_at, u.username, u.id, u.profile_image, post_id, me.followed_users, notifs.case FROM notifications as n JOIN users AS u ON sender_id = u.id JOIN users AS me ON me.id = user_id JOIN notifs ON notifs.id = n.id WHERE user_id = 95 AND sender_id != 95 AND notifs.case IS NOT NULL ORDER BY created_at DESC
CREATE VIEW notifs AS (select n.id, case when type = "LIKE" and u.likes_notif_active = 'true' then 'active' when type = 'COMMENT' and u.comments_notif_active = 'true' then 'active' when type = 'TAG' and u.tags_notif_active = 'true' then 'active' when type = 'FOLLOW' and u.follows_notif_active = 'true' then 'active' end from notifications as n join users as u on u.id = n.user_id where n.user_id = 95 and n.sender_id != 95);


SELECT username, content, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id in (SELECT unnest(comments) FROM writings AS w WHERE w.id = 110 ORDER BY unnest DESC LIMIT 3);
update users set valid = 'true' 
alter table users add column favourites integer[] 
select title from writings where id in (select unnest(favourites) from users where id = 95)
SELECT w.*, u.username FROM writings AS w JOIN users as u ON w.writer_id = u.id where w.id in (select unnest(favourites) from users where id = 95);
SELECT * FROM pg_stat_activity where usename = 'hpmmvdsprkgmwu';
SELECT pg_terminate_backend(25621) and select pg_terminate_backend(27339) and pg_terminate_backend(26443);
UPDATE commentItem SET responses = array_remove(responses, 6) WHERE id = 66
delete from comment_responses where id = 6
SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(comments) FROM writings AS w WHERE w.id = 110 ORDER BY unnest DESC LIMIT 3);
SELECT username, content, c.id, c.likes, c.responses, profile_image FROM comment_responses AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(responses) FROM commentItem AS ci WHERE ci.id = 66 ORDER BY unnest DESC LIMIT 3) ORDER BY id DESC ;
drop table comment_responses
alter table commentItem add column in_response_to integer
update commentItem set responses = array_remove(responses, 4)
select comments from writings where id = 110
SELECT username, content, c.id, c.likes, c.responses, c.in_response_to FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(comments) FROM writings AS w WHERE w.id = 110 ORDER BY unnest DESC) order by id;
SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.in_response_to = 68
update commentItem set is_comment = false where id = 70
select chapters, body from writings where id = 116


SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(comments) FROM writings AS w WHERE w.id = 110 ORDER BY unnest DESC) AND c.is_comment = true;
SELECT c.body, c.id FROM chapters AS c WHERE c.id IN (SELECT UNNEST(chapters) FROM writings AS w WHERE w.id = 116)
update writings set last_edited = now() where id = 114
select chapters from writings join chapters where id = 116
SELECT w.*, u.username, u.profile_image, u.id AS writer_id, c.body as chap FROM writings AS w JOIN users as u ON w.writer_id = u.id JOIN chapters AS c ON c.writing_id = w.id where c.writing_id in (select unnest(chapters) from writings as w2 where w2.id = w.id) AND w.id = 116

update validation_tokens set expiration_date = now()
select pid from pg_stat_activity where usename = 'hpmmvdsprkgmwu'
q hselect username from users where id in (select unnest(likes) from commentitem where id = 89)
delete from users where id = 61

alter table commentItem drop constraint chapters_writing_id_fkey
alter table commentitem add constraint in_response_to_id_fkey foreign key (in_response_to) references commentitem(id) on delete cascade;

SELECT username, content, c.id, c.likes, c.responses, profile_image FROM commentItem AS c JOIN users AS u ON u.id = commenter_id WHERE c.id IN (SELECT unnest(comments) FROM writings AS w WHERE w.id = 3 ORDER BY unnest DESC) AND c.is_comment = true;
delete from commentitem where id = 1
UPDATE writings SET comments = array_remove(comments, 1) WHERE id = 3
delete from commentitem where id = 16 returning in_response_to
