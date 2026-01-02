CREATE TABLE ecommerce_user (
  id BIGSERIAL PRIMARY KEY,
  password VARCHAR(128) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
  email VARCHAR(254) NOT NULL UNIQUE,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_staff BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ecommerce_user_role_check CHECK (role IN ('customer', 'seller', 'admin'))
);

CREATE INDEX ecommerce_user_role_idx ON ecommerce_user (role);

CREATE TABLE authtoken_token (
  key CHAR(40) PRIMARY KEY,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT UNIQUE NOT NULL,
  CONSTRAINT authtoken_token_user_id_fk
    FOREIGN KEY (user_id) REFERENCES ecommerce_user (id) ON DELETE CASCADE
);

CREATE INDEX authtoken_token_user_idx ON authtoken_token (user_id);
