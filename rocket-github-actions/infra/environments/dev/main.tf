locals {
  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

module "ecr" {
  source = "../../modules/ecr"

  repository_name = "${var.project_name}-${var.environment}"
  tags            = local.tags
}

module "apprunner_service" {
  source = "../../modules/apprunner_service"

  service_name                  = "${var.project_name}-${var.environment}"
  image_identifier              = "${module.ecr.repository_url}:${var.image_tag}"
  health_check_path             = var.health_check_path
  runtime_environment_variables = merge(var.common_env_vars, var.environment_env_vars)
  instance_cpu                  = var.instance_cpu
  instance_memory               = var.instance_memory
  max_concurrency               = var.max_concurrency
  min_size                      = var.min_size
  max_size                      = var.max_size
  tags                          = local.tags
}
