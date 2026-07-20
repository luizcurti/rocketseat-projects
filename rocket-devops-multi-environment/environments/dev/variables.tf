variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "project_name" {
  description = "Project identifier"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs"
  type        = list(string)
}

variable "ami_id" {
  description = "EC2 AMI ID"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 80
}

variable "desired_capacity" {
  description = "ASG desired capacity"
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
  description = "Target group health check path"
  type        = string
  default     = "/"
}

variable "health_check_grace_period" {
  description = "ASG health check grace period"
  type        = number
  default     = 120
}

variable "alb_ingress_cidrs" {
  description = "Allowed CIDRs to access ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "certificate_arn" {
  description = "Optional ACM certificate ARN"
  type        = string
  default     = null
  nullable    = true
}

variable "key_name" {
  description = "Optional key pair name"
  type        = string
  default     = null
  nullable    = true
}

variable "root_volume_size" {
  description = "Root volume size in GiB"
  type        = number
  default     = 20
}

variable "create_secret_version" {
  description = "Create a secret version with app_secrets"
  type        = bool
  default     = false
}

variable "app_secrets" {
  description = "Sensitive app secrets"
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}
