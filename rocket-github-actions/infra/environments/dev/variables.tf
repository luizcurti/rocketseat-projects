variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "app-cicd"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "image_tag" {
  description = "Container image tag"
  type        = string
  default     = "latest"
}

variable "health_check_path" {
  description = "HTTP path used by App Runner health check"
  type        = string
  default     = "/health"
}

variable "common_env_vars" {
  description = "Environment variables shared by all environments"
  type        = map(string)
  default     = {}
}

variable "environment_env_vars" {
  description = "Environment specific variables"
  type        = map(string)
  default     = {}
}

variable "instance_cpu" {
  description = "App Runner CPU"
  type        = string
  default     = "1024"
}

variable "instance_memory" {
  description = "App Runner memory"
  type        = string
  default     = "2048"
}

variable "max_concurrency" {
  description = "Autoscaling maximum concurrency"
  type        = number
  default     = 100
}

variable "min_size" {
  description = "Minimum instances"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum instances"
  type        = number
  default     = 3
}
