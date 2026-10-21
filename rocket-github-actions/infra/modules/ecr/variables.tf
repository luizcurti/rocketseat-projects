variable "repository_name" {
  description = "ECR repository name"
  type        = string
}

variable "scan_on_push" {
  description = "Enable ECR image scanning on push"
  type        = bool
  default     = true
}

variable "image_tag_mutability" {
  description = "Tag mutability for ECR images"
  type        = string
  default     = "MUTABLE"
}

variable "tags" {
  description = "Tags for all resources"
  type        = map(string)
  default     = {}
}
