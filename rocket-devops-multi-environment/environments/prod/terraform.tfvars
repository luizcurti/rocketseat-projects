aws_region           = "us-east-1"
project_name         = "iac-multi-ambiente"
vpc_cidr             = "10.10.0.0/16"
azs                  = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs  = ["10.10.1.0/24", "10.10.2.0/24"]
private_subnet_cidrs = ["10.10.11.0/24", "10.10.12.0/24"]

# Atualize com uma AMI válida para a sua conta/região.
ami_id           = "ami-xxxxxxxxxxxxxxxxx"
instance_type    = "t3.medium"
app_port         = 80
desired_capacity = 3
min_size         = 2
max_size         = 6

# Em produção, restrinja CIDRs para origem confiável.
alb_ingress_cidrs         = ["0.0.0.0/0"]
health_check_path         = "/"
health_check_grace_period = 120
root_volume_size          = 40
create_secret_version     = false

# Opcional (recomendado em prod: habilitar TLS com ACM)
certificate_arn = null
key_name        = null

tags = {
  Workload = "web"
  Owner    = "plataforma"
}
