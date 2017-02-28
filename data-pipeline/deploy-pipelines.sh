# AWS_PROFILE=Treefort aws datapipeline create-pipeline --name dev-performer-to-prod-performer-scheduled --unique-id dev-performer-to-prod-performer-scheduled
# {
#   "pipelineId": "df-01909023RXS4QU2UQSIO"
# }
AWS_PROFILE=Treefort aws datapipeline put-pipeline-definition --pipeline-id df-01909023RXS4QU2UQSIO --pipeline-definition file://dev-performer-to-prod-performer.json

# AWS_PROFILE=Treefort aws datapipeline create-pipeline --name dev-playlist-to-prod-playlist-scheduled --unique-id dev-playlist-to-prod-playlist-scheduled
# {
#    "pipelineId": "df-09307492PRQ6EM3MUT9N"
# }
AWS_PROFILE=Treefort aws datapipeline put-pipeline-definition --pipeline-id df-09307492PRQ6EM3MUT9N --pipeline-definition file://dev-playlist-to-prod-playlist.json

