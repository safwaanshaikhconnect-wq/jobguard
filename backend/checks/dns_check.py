import dns.resolver
import asyncio
import re

async def check_email_mx(email: str) -> dict:
    if not email or "@" not in email:
        return {
            "name": "Email Domain Authenticity",
            "status": "unknown",
            "detail": "No contact email provided."
        }

    # Extract domain
    domain = email.split("@")[-1].lower()
    
    # Check for common free providers
    free_providers = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com", "rediffmail.com"]
    if domain in free_providers:
        return {
            "name": "Email Domain Authenticity",
            "status": "unknown",
            "detail": f"Using a free provider ({domain}). Corporate identity unverified."
        }

    try:
        # Run DNS query in a thread to keep things async
        loop = asyncio.get_event_loop()
        
        def run_mx_query():
            try:
                # Resolve MX (Mail Exchange) records
                records = dns.resolver.resolve(domain, 'MX')
                return [str(r.exchange) for r in records]
            except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
                return []
            except Exception:
                return None

        mx_records = await loop.run_in_executor(None, run_mx_query)

        if mx_records is None:
            return {
                "name": "Email Domain Authenticity",
                "status": "unknown",
                "detail": f"DNS Server timed out for domain: {domain}"
            }

        if len(mx_records) == 0:
            return {
                "name": "Email Domain Authenticity",
                "status": "fail",
                "detail": f"CRITICAL: Domain '{domain}' has NO mail servers. Cannot receive corporate email!"
            }

        # If it has MX records, it's a real configured domain
        return {
            "name": "Email Domain Authenticity",
            "status": "pass",
            "detail": f"Domain {domain} is a verified mail server with {len(mx_records)} MX records."
        }

    except Exception as e:
        return {
            "name": "Email Domain Authenticity",
            "status": "unknown",
            "detail": f"DNS resolution failed: {str(e)}"
        }

if __name__ == "__main__":
    async def run_test():
        print(await check_email_mx("hr@microsoft.com"))
        print(await check_email_mx("scammer@fake-jobs-site-123.com"))
        print(await check_email_mx("test@gmail.com"))

    asyncio.run(run_test())
