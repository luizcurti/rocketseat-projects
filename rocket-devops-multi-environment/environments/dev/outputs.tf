output "vpc_id" {
  value = module.environment.vpc_id
}

output "alb_dns_name" {
  value = module.environment.alb_dns_name
}

output "autoscaling_group_name" {
  value = module.environment.autoscaling_group_name
}

output "secret_arn" {
  value = module.environment.secret_arn
}
