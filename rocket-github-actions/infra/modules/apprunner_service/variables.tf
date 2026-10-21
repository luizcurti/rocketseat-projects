variable "service_name" {
  description = "App Runner service name"
  type        = string
}

variable "image_identifier" {
  description = "Container image identifier in format <repository_url>:<tag>"
  type        = string
}

variable "container_port" {
  description = "Container port"
  type        = string
  default     = "8080"
}

variable "runtime_environment_variables" {
  description = "Environment variables injected into the service"
  type        = map(string)
  default     = {}
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

variable "healthy_threshold" {
  description = "Number of consecutive successful checks"
  type        = number
  default     = 1
}

variable "unhealthy_threshold" {
  description = "Number of consecutive failed checks"
  type        = number
  default     = 5
}

variable "health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 10
}

variable "health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "instance_cpu" {
  description = "App Runner instance CPU"
  type        = string
  default     = "1024"
}

variable "instance_memory" {
  description = "App Runner instance memory"
  type        = string
  default     = "2048"
}

variable "instance_role_arn" {
  description = "Optional instance role ARN"
  type        = string
  default     = null
}

variable "max_concurrency" {
  description = "Maximum concurrency per instance"
  type        = number
  default     = 100
}

variable "max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 25
}

variable "min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "tags" {
  description = "Tags for all resources"
  type        = map(string)
  default     = {}
}
