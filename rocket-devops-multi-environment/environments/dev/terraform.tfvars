aws_region           = "us-east-1"
project_name         = "iac-multi-ambiente"
vpc_cidr             = "10.30.0.0/16"
azs                  = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs  = ["10.30.1.0/24", "10.30.2.0/24"]
private_subnet_cidrs = ["10.30.11.0/24", "10.30.12.0/24"]

# Atualize com uma AMI válida para a sua conta/região.
ami_id           = "ami-xxxxxxxxxxxxxxxxx"
instance_type    = "t3.micro"
app_port         = 80
desired_capacity = 1
min_size         = 1
max_size         = 2

alb_ingress_cidrs         = ["0.0.0.0/0"]
health_check_path         = "/"
health_check_grace_period = 120
root_volume_size          = 20
create_secret_version     = false

# Opcional
certificate_arn = null
key_name        = null

tags = {
  Workload = "web"
  Owner    = "plataforma"
}
