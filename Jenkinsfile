pipeline {
    agent any
    environment {
        OPENCV4NODEJS_DISABLE_AUTOBUILD = 1
        OPENCV_INCLUDE_DIR  = '/opt/opencv/include/'
        OPENCV_LIB_DIR      = '/opt/opencv/build/lib/'
        OPENCV_BIN_DIR      = '/opt/opencv/build/bin/'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building ...'
                sh 'npm install'
                sh 'npm run clean'
                sh 'npm run build:cjs'
                sh 'npm run build:esm'
                sh 'npm run build:webpack'
            }
        }
        stage('Quality') {
            steps {
                echo 'Checking code quality ...'
                sh 'npm run lint'
            }
        }
        stage('Documentation') {
            steps {
                echo 'Building Documentation..'
                sh 'npm run build:typedoc'
            }
        }
        stage('Publish') {
            parallel {
                stage('Publish Development') {
                    when {
                        branch "dev"
                    }
                    steps {
                        echo 'Publishing Development ...'
                        sh 'npm run publish:development'
                        sshagent(['git-openhps-ssh']) {
                            sh 'git push origin HEAD:dev'
                        }
                    }
                }
                stage('Publish Release') {
                    when {
                        branch "master"
                    }
                    steps {
                        echo 'Publishing Release ...'
                        sh 'npm run publish:release'
                        sh 'git push origin HEAD:master'
                        sshagent(['git-openhps-ssh']) {
                            sh "git push origin master"
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'docs/out',
                reportFiles: '*.*',
                reportName: "Documentation"
            ])
            archiveArtifacts artifacts: 'dist/web/openhps-opencv.js', fingerprint: true
            archiveArtifacts artifacts: 'dist/web/openhps-opencv.js.map', fingerprint: true
            archiveArtifacts artifacts: 'dist/web/openhps-opencv.min.js', fingerprint: true
            archiveArtifacts artifacts: 'dist/web/openhps-opencv.min.js.map', fingerprint: true
            deleteDir()
        }
    }
}