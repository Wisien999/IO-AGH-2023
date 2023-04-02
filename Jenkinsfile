def customImage;

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
		checkout scm                
		//git branch: 'main', credentialsId: 'e08c748d-2913-4686-b87e-76476c46f473', url: 'https://github.com/Wisien999/IO-AGH-2023.git'
                    
                script {
                    customImage = docker.build("stormydata/io-agh-2023:0.0.${env.BUILD_ID}")
                }
            }
        }
        stage('Publish') {
            steps {
                script {
                    docker.withRegistry("", "dockerhub-stormydata") {
                        customImage.push()
                        customImage.push("latest")
                    }    
                }
            }
        }
    }
}

