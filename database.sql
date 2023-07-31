CREATE TABLE "tasks"(
	"id" serial primary key,
	"task" varchar (150) not null,
	"pending" BOOLEAN DEFAULT false,
	"completetime" date
);

INSERT INTO "tasks" ("task")
VALUES 
('do dishes'), ('dance party planning');