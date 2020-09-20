/* Replace with your SQL commands */
CREATE TABLE email_providers
(
    id serial NOT NULL,
    modified timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    created timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    name character varying(50),
    status smallint DEFAULT 1,
    priority smallint DEFAULT 1,
    module character varying(200),
    sender character varying(200),
    PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_providers_modtime 
BEFORE UPDATE ON email_providers 
FOR EACH ROW 
EXECUTE PROCEDURE  update_modified_column();