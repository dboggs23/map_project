C:\ProgramData\chocolatey\bin\make.exe dev
for dev run c# outside of docker?

github self hosted runner stops working if it hasn't been used in 30 days. which sucks.
to reinstall it, rm -rf the actions_runner folder and go through the process of installing the runner via github actions: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners. should automate this via cron job.

for ssl cert use:
sudo certbot certonly --nginx
need to set up chron job so it runs every 90 days at most. nginx container needs to restart after being ran
