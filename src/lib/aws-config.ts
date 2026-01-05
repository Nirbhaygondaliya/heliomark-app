// AWS Configuration for Heliomark AI

export const awsConfig = {
  // Cognito
  cognito: {
    userPoolId: 'ap-south-1_THRttEMgc',
    clientId: '408krt51e0fqr0amktjiqvgnbm',
    region: 'ap-south-1',
  },
  
  // API Gateway
  api: {
    baseUrl: 'https://zupyj99g82.execute-api.ap-south-1.amazonaws.com',
  },
  
  // S3 (for reference, uploads go through presigned URLs)
  s3: {
    bucket: 'heliomark-uploads',
    region: 'ap-south-1',
  }
}
