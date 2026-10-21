variable "project_name" {
  description = "Project identifier used in resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
}

variable "azs" {
  description = "Availability zones used by this environment"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "ami_id" {
  description = "AMI used by EC2 instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for app nodes"
  type        = string
}

variable "app_port" {
  description = "Application port exposed by the instance"
  type        = number
  default     = 80
}

variable "desired_capacity" {
  description = "Desired number of EC2 instances"
  type        = number
}

variable "min_size" {
  description = "ASG minimum size"
  type        = number
}

variable "max_size" {
  description = "ASG maximum size"
  type        = number
}

variable "health_check_path" {
  description = "HTTP path used for target group health checks"
  type        = string
  default     = "/"
}

variable "health_check_grace_period" {
  description = "ASG grace period before ELB health checks"
  type        = number
  default     = 120
}

variable "alb_ingress_cidrs" {
  description = "CIDR blocks allowed to access ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener. Leave null to use HTTP only."
  type        = string
  default     = null
  nullable    = true
}

variable "key_name" {
  description = "Optional EC2 key pair name"
  type        = string
  default     = null
  nullable    = true
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB"
  type        = number
  default     = 20
}

variable "create_secret_version" {
  description = "If true, writes app_secrets content to Secrets Manager"
  type        = bool
  default     = false
}

variable "app_secrets" {
  description = "Key-value secrets to be stored in Secrets Manager"
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "tags" {
  description = "Additional tags applied to all resources"
  type        = map(string)
  default     = {}
}
