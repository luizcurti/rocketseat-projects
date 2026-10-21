output "repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "service_url" {
  description = "App Runner URL"
  value       = module.apprunner_service.service_url
}

output "service_arn" {
  description = "App Runner ARN"
  value       = module.apprunner_service.service_arn
}
