module "environment" {
  source = "../../modules/app_environment"

  project_name              = var.project_name
  environment               = "staging"
  vpc_cidr                  = var.vpc_cidr
  azs                       = var.azs
  public_subnet_cidrs       = var.public_subnet_cidrs
  private_subnet_cidrs      = var.private_subnet_cidrs
  ami_id                    = var.ami_id
  instance_type             = var.instance_type
  app_port                  = var.app_port
  desired_capacity          = var.desired_capacity
  min_size                  = var.min_size
  max_size                  = var.max_size
  health_check_path         = var.health_check_path
  health_check_grace_period = var.health_check_grace_period
  alb_ingress_cidrs         = var.alb_ingress_cidrs
  certificate_arn           = var.certificate_arn
  key_name                  = var.key_name
  root_volume_size          = var.root_volume_size
  create_secret_version     = var.create_secret_version
  app_secrets               = var.app_secrets
  tags                      = merge(var.tags, { Tier = "staging" })
}
