create table if not exists analyses (
  id text primary key,
  input_type text,
  input_text text,
  scam_detected boolean,
  scam_type text,
  confidence integer,
  risk_score integer,
  explanation text,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id text primary key,
  amount numeric,
  recipient_name text,
  recipient_upi text,
  new_recipient boolean,
  message_risk integer,
  url_risk integer,
  device_risk integer,
  transaction_risk integer,
  final_risk integer,
  decision text,
  created_at timestamptz default now()
);

create table if not exists threats (
  id text primary key,
  threat_type text,
  severity text,
  description text,
  source text,
  created_at timestamptz default now()
);

create table if not exists demo_scenarios (
  id text primary key,
  name text,
  description text,
  message text,
  url text,
  amount numeric,
  recipient text,
  device_risk integer,
  expected_decision text
);
