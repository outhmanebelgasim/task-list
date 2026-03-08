<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Relations\HasMany;

class TaskList extends Model
{
    protected $table = "lists";
    protected $fillable = [
        "title",
        "description",
        "user_id"
    ];

    public function list(){
        return $this->hasMany(Task::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
