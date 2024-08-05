
from collections import Counter
from django.shortcuts import render, redirect
from .models import Vote
from .forms import VoteForm
import json

def vote(request):
    # Handle form submission
    if request.method == 'POST':
        form = VoteForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = VoteForm()

    # Query the database to get the votes
    votes = Vote.objects.values_list('choice', flat=True)

    # Count the occurrences of each candidate
    candidate_counts = dict(Counter(votes))

    # Format data for D3.js
    plot_data = [{'choice': k, 'votes': v} for k, v in candidate_counts.items()]

    # Render template with form and histogram data
    return render(request, 'voting_app/vote.html', {
        'form': form,
        'plot_data': json.dumps(plot_data)
    })
def success(request):
    return render(request, 'voting_app/success.html')