{{- define "apicurio-studio.secretName" -}}
{{- if .Values.existingSecret }}
    {{- printf "%s" .Values.existingSecret -}}
{{- else -}}
apicurio-secret
{{- end -}}
{{- end -}}