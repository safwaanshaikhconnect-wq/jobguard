import whois
from urllib.parse import urlparse
from datetime import datetime
import asyncio

async def check_domain_age(url: str) -> dict:
    if not url:
        return {
            "name": "Domain Age Check",
            "status": "unknown",
            "detail": "No URL provided for verification."
        }
        
    try:
        # Extract domain from URL
        parsed = urlparse(url)
        domain = parsed.netloc if parsed.netloc else parsed.path.split('/')[0]
        
        # Strip subdomains or port numbers for simple extraction (basic approach)
        if ":" in domain:
            domain = domain.split(":")[0]
            
        if not domain or domain == 'N/A':
            return {
                "name": "Domain Age Check",
                "status": "unknown",
                "detail": "Could not extract a valid domain from the provided URL."
            }

        # Run the blocking whois query in a thread so we don't block the async event loop
        loop = asyncio.get_event_loop()
        domain_info = await loop.run_in_executor(None, whois.whois, domain)
        
        if not domain_info or not domain_info.creation_date:
            return {
                "name": "Domain Age Check",
                "status": "unknown",
                "detail": f"No WHOIS creation date found for {domain}."
            }
            
        # creation_date can be a list or a single datetime object
        creation_date = domain_info.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
            
        # Strip timezone info to prevent naive/aware datetime math errors
        if creation_date.tzinfo is not None:
            creation_date = creation_date.replace(tzinfo=None)
            
        # Calculate age
        age = (datetime.now() - creation_date).days
        years = age / 365.25
        
        # If domain is less than 6 months (180 days) old, flag it
        if age < 180:
            return {
                "name": "Domain Age Check",
                "status": "fail",
                "detail": f"Domain {domain} is newly registered ({age} days old). High risk indicator."
            }
            
        return {
            "name": "Domain Age Check",
            "status": "pass",
            "detail": f"Domain {domain} was registered {years:.1f} years ago. Appears established."
        }

    except Exception as e:
        return {
            "name": "Domain Age Check",
            "status": "unknown",
            "detail": f"WHOIS verification failed for {domain}: {str(e)}"
        }

# Quick test block to prove it works before you run it!
if __name__ == "__main__":
    async def run_test():
        print("Testing established domain (google.com):")
        result1 = await check_domain_age("https://google.com/careers")
        print(result1)
        
        print("\nTesting missing URL:")
        result2 = await check_domain_age("")
        print(result2)
        
    asyncio.run(run_test())
